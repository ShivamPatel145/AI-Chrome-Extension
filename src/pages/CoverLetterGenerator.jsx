import React, { useEffect, useState } from "react";
import { PAGES } from "../utils/constants";
import { loadData } from "../utils/localStorage";
import { postGeminiMessage } from "../utils/geminiApi";

// ── Icons ─────────────────────────────────────────────────────────────────────

function LinkedInLogo() {
  return (
    <div className="w-11 h-11 rounded-xl border border-linkedin-200/60 p-1 flex items-center justify-center shrink-0 shadow-sm">
      <svg
        viewBox="0 0 512 512"
        fill="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="#1B2D4A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M148 72H296L368 144V400C368 412 358 422 346 422H148C136 422 126 412 126 400V94C126 82 136 72 148 72Z" />
          <path d="M296 72V144H368" />
          <path d="M178 200H296" />
          <path d="M178 240H296" />
          <path d="M178 280H248" />
        </g>

        <rect x="262" y="262" width="130" height="130" rx="26" fill="#0A66C2" />

        <path
          d="M355.5 289.5C358.8 286.2 364.2 286.2 367.5 289.5C370.8 292.8 370.8 298.2 367.5 301.5L325 344L308 348L312 331L355.5 289.5Z"
          fill="white"
        />
        <path
          d="M308 356H362"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SparklesIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="2"
        y="7"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12v.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12.01"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function Skeleton() {
  const widths = ["w-full", "w-4/5", "w-11/12", "w-3/5", "w-5/6", "w-1/2"];
  return (
    <div className="px-4 py-5 flex flex-col gap-3">
      {widths.map((w, i) => (
        <div
          key={i}
          className={`h-2.5 ${w} rounded-full bg-gradient-to-r from-warm-100 via-warm-300 to-warm-100 bg-[length:200%_100%] animate-shimmer`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="w-3.5 h-3.5 border-2 border-linkedin-200 border-t-linkedin-500 rounded-full animate-spin" />
        <p className="text-[11px] text-gray-400 font-medium">
          Crafting your letter…
        </p>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

const STEPS = [
  ["1", "Open a LinkedIn job listing", "Browse jobs on LinkedIn"],
  ["2", "Return here & click Generate", "We'll read the job details"],
  ["3", "Copy and send your letter", "Personalized & ready to go"],
];

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-linkedin-50 border border-linkedin-100 flex items-center justify-center mb-2 py-3">
        <BriefcaseIcon className="text-linkedin-500" />
      </div>
      <p className="text-[15px] font-semibold text-linkedin-900 tracking-tight mb-1.5">
        Ready to generate
      </p>
      <p className="text-[12px] text-gray-500 leading-relaxed max-w-[250px] mb-4">
        Open a LinkedIn job posting, then come back and click Generate below.
      </p>
      <div className="flex flex-col gap-3.5 w-full max-w-[275px]">
        {STEPS.map(([n, label, hint]) => (
          <div key={n} className="flex items-start gap-3.5 text-left">
            <span className="w-7 h-7 rounded-full bg-linkedin-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              {n}
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-linkedin-900 leading-tight">
                {label}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CoverLetterGenerator({
  setPage,
  resume,
  geminiApiKey,
  letterTone,
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [letterLength, setLetterLength] = useState("medium");

  useEffect(() => {
    let alive = true;
    loadData("jobDescription")
      .then((d) => {
        if (alive) setJobDescription(d || "");
      })
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const generate = async () => {
    if (isLoading) return;
    const key = geminiApiKey?.trim();
    const res = resume?.trim();
    const jdRaw = jobDescription?.trim();

    // Clean LinkedIn noise
    const jd = jdRaw
      ?.replace(
        /Apply|Applied|1 day ago|days ago|people clicked apply|Hybrid|Full-time|Part-time/gi,
        "",
      )
      ?.replace(/\n{2,}/g, "\n") // remove extra line breaks
      ?.trim();

    if (!key) return setErrorMessage("Add your Gemini API key in Settings.");
    if (!res) return setErrorMessage("Add your resume in Settings.");
    if (!jd) return setErrorMessage("Open a LinkedIn job post, then retry.");

    setErrorMessage("");
    setIsLoading(true);
    setCoverLetter("");
    setCopied(false);

    try {
      const selectedTone = letterTone || "professional";
      const selectedLength = letterLength || "medium";

      // Compact tone & length configs
      const toneGuides = {
        professional:
          "Professional tone: Show alignment with company & relevant achievements",
        enthusiastic:
          "Enthusiastic tone: Lead with passion for the role. Show genuine excitement",
        technical:
          "Technical tone: Highlight tools, metrics, & technical accomplishments",
        strategic:
          "Strategic tone: Focus on business impact & leadership decisions",
      };

      const lengthConfigs = {
        short: { words: "90-130", paras: "1-2" },
        medium: { words: "180-240", paras: "2-3" },
        long: { words: "300-380", paras: "3-4" },
      };

      const toneGuidance = toneGuides[selectedTone] || toneGuides.professional;
      const { words, paras } =
        lengthConfigs[selectedLength] || lengthConfigs.medium;

      const prompt = `Write a highly personalized, human-sounding cover letter tailored to THIS candidate and THIS job.

      Extract relevant experience from the profile. Ignore LinkedIn UI noise. Identify 2–3 key job requirements and match them directly.

      Tone: ${toneGuidance}

      Format: ${words} words, ${paras} paragraphs (NO greeting or closing)

      Rules:
      - Start with strongest, most relevant achievement
      - Focus on RESULTS (metrics, scale, impact), not responsibilities
      - Mention specific tools/technologies and WHY they were used
      - Align experience with company mission or domain
      - Show clear value for this role

      Avoid:
      - "I am excited to apply", "I believe I am a good fit"
      - Generic or reusable statements
      - Repeating resume without adding insight

      Write naturally, confidently, like a real engineer.

      PROFILE:
      ${res}

      JOB:
      ${jd}

      If the output feels generic or could apply to any company, rewrite it.

      Generate now:`;

      setCoverLetter(await postGeminiMessage(prompt, key));
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
    } catch {
      setErrorMessage("Failed to copy.");
    }
  };

  const missingSetup = !geminiApiKey?.trim() || !resume?.trim();

  const nudgeText =
    !geminiApiKey?.trim() && !resume?.trim()
      ? "Set up your API key & resume to begin."
      : !geminiApiKey?.trim()
        ? "Add your Gemini API key in Settings."
        : "Paste your resume in Settings.";

  const statusDot = isLoading
    ? "bg-amber-400 animate-pulse"
    : coverLetter
      ? "bg-green-500"
      : "bg-gray-300";

  const statusLabel = isLoading
    ? "Generating"
    : coverLetter
      ? "Complete"
      : "Awaiting input";

  return (
    <div className="flex flex-col w-[420px] h-[560px] bg-warm-100 font-sans text-linkedin-900 overflow-hidden">
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200/80 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <LinkedInLogo />
          <div>
            <p className="text-[14px] font-bold text-linkedin-900 tracking-tight leading-tight">
              CoverCraft
            </p>
            <p className="text-[11px] text-gray-500 mt-1 leading-none">
              LinkedIn → tailored letter
            </p>
          </div>
        </div>
        <button
          onClick={() => setPage(PAGES.PROFILE)}
          className="w-8 h-8 rounded-lg border border-warm-300/80 bg-warm-50 text-gray-500 flex items-center justify-center hover:bg-linkedin-50 hover:text-linkedin-500 hover:border-linkedin-200 transition-colors"
          title="Settings"
        >
          <SettingsIcon />
        </button>
      </header>

      {/* ─── Setup nudge ──────────────────────────────────── */}
      {missingSetup && !errorMessage && (
        <div className="mx-3 mt-1.5 flex items-center gap-2.5 px-3 py-2 bg-linkedin-50 border border-linkedin-100 rounded-lg text-[10.5px] text-linkedin-600 shrink-0 animate-fade-in">
          <AlertCircleIcon />
          <span className="flex-1 font-medium">{nudgeText}</span>
          <button
            onClick={() => setPage(PAGES.PROFILE)}
            className="text-[10px] font-bold text-linkedin-500 whitespace-nowrap hover:text-linkedin-700 transition-colors"
          >
            Setup →
          </button>
        </div>
      )}

      {/* ─── Error banner ─────────────────────────────────── */}
      {errorMessage && (
        <div className="mx-3 mt-1.5 flex items-center gap-2.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10.5px] text-red-600 shrink-0 animate-fade-in">
          <span className="flex-1 font-medium">⚠ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-300 hover:text-red-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Letter Length Selector ───────────────────────── */}
      <div className="px-3 py-2 shrink-0 bg-warm-100 border-b border-warm-200/50">
        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1.5 px-1">
          Letter Length
        </p>
        <div className="flex gap-2">
          {[
            { value: "short", label: "Short", hint: "2-3 para" },
            { value: "medium", label: "Medium", hint: "3-4 para" },
            { value: "long", label: "Long", hint: "4-5 para" },
          ].map(({ value, label, hint }) => (
            <button
              key={value}
              onClick={() => setLetterLength(value)}
              disabled={isLoading}
              className={`flex-1 p-3 rounded-lg text-[10px] font-semibold transition-all
                ${
                  letterLength === value
                    ? "bg-linkedin-500 text-white border border-linkedin-600 shadow-sm"
                    : "bg-white text-gray-600 border border-warm-300/80 hover:border-linkedin-200 hover:bg-linkedin-50"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="leading-tight">{label}</div>
              <div className="text-[8px] opacity-70">{hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Output panel ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 mx-3 my-1.5 bg-white border border-warm-300/60 rounded-xl shadow-sm overflow-hidden min-h-0">
        {/* Panel status bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-warm-200 bg-warm-50/80 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${statusDot}`}
            />
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.15em]">
              {statusLabel}
            </span>
          </div>
          {coverLetter && (
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1 text-[9.5px] font-semibold px-2.5 py-1 rounded-lg border transition-all
                ${
                  copied
                    ? "text-green-600 bg-green-50 border-green-200"
                    : "text-gray-500 bg-white border-warm-300/80 hover:border-linkedin-200 hover:text-linkedin-500 hover:bg-linkedin-50"
                }`}
            >
              {copied ? (
                <>
                  <CheckIcon /> Copied!
                </>
              ) : (
                <>
                  <CopyIcon /> Copy
                </>
              )}
            </button>
          )}
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <Skeleton />
          ) : coverLetter ? (
            <p className="px-3 py-3 text-[12px] text-gray-600 leading-[1.75] whitespace-pre-wrap animate-fade-in">
              {coverLetter}
            </p>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ─── Generate button ──────────────────────────────── */}
      <div className="px-3 pb-3 shrink-0">
        <button
          onClick={generate}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all
            ${
              isLoading
                ? "bg-warm-300 text-gray-400 cursor-not-allowed"
                : "bg-linkedin-500 text-white hover:bg-linkedin-600 active:scale-[0.98]"
            }`}
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <SparklesIcon className="w-3.5 h-3.5" />
              Generate Cover Letter
            </>
          )}
        </button>
      </div>
    </div>
  );
}
