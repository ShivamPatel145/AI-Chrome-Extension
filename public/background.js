/*global chrome*/

const JOB_DESCRIPTION_MESSAGE = "JOB_DESCRIPTION";

// Listen for job description from content script
chrome.runtime.onMessage.addListener((message) => {
  if (
    !message ||
    message.type !== JOB_DESCRIPTION_MESSAGE ||
    typeof message.payload !== "string"
  ) {
    return;
  }

  const jobDescription = message.payload.trim();
  if (!jobDescription) return;

  chrome.storage.local.set({ jobDescription }).catch((error) => {
    console.error("Failed to store job description", error);
  });
});
