/*global chrome*/

const JOB_DESCRIPTION_MESSAGE = "JOB_DESCRIPTION";
const POLL_INTERVAL_MS = 2000;
const DESCRIPTION_SELECTORS = [
  '[class*="jobs-search__job-details"]',
  '[class*="jobs-description-content"]',
];

// Keep patterns in module scope to avoid rebuilding regex arrays on every call.
const CLEANUP_PATTERNS = [
  /Share\b/gi,
  /Show more options/gi,
  /Easy Apply/gi,
  /\bSave\b/gi,
  /Try Premium/gi,
  /show more/gi,
  /See how you compare/gi,
  /Access exclusive applicant insights/gi,
  /No response insights available yet/gi,
  /Over\s+Promoted by hirer/gi,
  /Company review time is typically.*?week/gi,
  /Meet the hiring team/gi,
  /Job poster/gi,
  /\bMessage\b/gi,
  /Talent Acquisition Lead[^\n]*/gi,
  /\d+(?:st|nd|rd|th)?\+\s*\n/gi,
  /to over \d+[\w\s]+applicants/gi,
  /\d+\s+applicants/gi,
  /0 of \d+ skills match/gi,
  /,\s*see\s+jobs\s+where[^.]*\./gi,
  /for\s+₹\d+/gi,
  /Matches your job preferences.*?\./gi,
  /Follow\b/gi,
  /\d+,\d+\s+followers/gi,
  /^\s*\.\s+/gm,
  /\(Remote\s*\/\s*Freelancing\)/gi,
];

function cleanText(text) {
  let cleaned = String(text || "");

  CLEANUP_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Normalize whitespace while preserving line boundaries.
  cleaned = cleaned.replace(/\r\n?/g, "\n");
  cleaned = cleaned.replace(/\n\s*\n/g, "\n");
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  cleaned = cleaned.replace(/,\s*,/g, ","); // Remove double commas
  cleaned = cleaned.replace(/,\s*\n/g, "\n"); // Remove trailing commas
  cleaned = cleaned.replace(/^\s*,/gm, ""); // Remove leading commas
  cleaned = cleaned.replace(/…\s*$/gm, ""); // Remove trailing ellipsis

  return cleaned.trim();
}

function getDescriptionContainer() {
  for (const selector of DESCRIPTION_SELECTORS) {
    const container = document.querySelector(selector);
    if (container) return container;
  }

  return null;
}

function extractJobDescription() {
  const container = getDescriptionContainer();

  if (!container) return null;

  const rawText =
    (typeof container.innerText === "string" && container.innerText) ||
    container.textContent ||
    "";
  if (!rawText.trim()) return null;

  return cleanText(rawText);
}

// Debounce helper to avoid too many calls
function debounce(func, wait) {
  let timeoutId = null;

  const debounced = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

// Send job description to background script
let lastSentJobDescription = "";

function hasRuntimeMessaging() {
  return (
    typeof chrome !== "undefined" &&
    Boolean(chrome.runtime) &&
    typeof chrome.runtime.sendMessage === "function"
  );
}

function sendJobDescription() {
  let previousLastSent = lastSentJobDescription;

  try {
    if (!hasRuntimeMessaging()) return;

    const jobDescription = extractJobDescription();
    if (!jobDescription || jobDescription === lastSentJobDescription) return;

    previousLastSent = lastSentJobDescription;
    // Optimistically mark this payload as sent to prevent duplicate in-flight messages.
    lastSentJobDescription = jobDescription;

    const maybePromise = chrome.runtime.sendMessage({
      type: JOB_DESCRIPTION_MESSAGE,
      payload: jobDescription,
    });

    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {
        // Restore previous state so this description can be retried later.
        if (lastSentJobDescription === jobDescription) {
          lastSentJobDescription = previousLastSent;
        }
      });
    }
  } catch (_error) {
    // Restore previous value so the same payload can be retried later.
    lastSentJobDescription = previousLastSent;
  }
}

// Debounced version to avoid message spam
const debouncedSend = debounce(sendJobDescription, 500);

let observer = null;
let intervalId = null;
let lastKnownUrl = location.href;
let hasStartedTracking = false;

// Extract and send job description when page loads
function init() {
  sendJobDescription();
}

function startObserver() {
  if (!document.body || observer) return;

  // Watch for dynamic content changes (LinkedIn loads content dynamically)
  observer = new MutationObserver(() => {
    debouncedSend();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function startPolling() {
  if (intervalId) return;

  // Also set up a periodic check in case the observer misses updates
  intervalId = setInterval(() => {
    if (document.hidden) return;

    if (location.href !== lastKnownUrl) {
      lastKnownUrl = location.href;
      sendJobDescription();
      return;
    }

    const container = getDescriptionContainer();
    const containerText =
      (container &&
        ((typeof container.innerText === "string" && container.innerText) ||
          container.textContent ||
          "")) ||
      "";

    if (containerText.trim().length > 0) {
      debouncedSend();
    }
  }, POLL_INTERVAL_MS);
}

function handleVisibilityChange() {
  if (document.hidden) return;
  debouncedSend();
}

function startTracking() {
  if (hasStartedTracking) return;
  hasStartedTracking = true;

  init();
  startObserver();
  startPolling();
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startTracking, { once: true });
} else {
  startTracking();
}

window.addEventListener("pagehide", () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  document.removeEventListener("visibilitychange", handleVisibilityChange);
  debouncedSend.cancel();
  hasStartedTracking = false;
});
