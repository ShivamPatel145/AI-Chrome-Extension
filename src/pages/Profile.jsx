import React, { useState } from "react";
import { PAGES, TOAST_CONFIG } from "../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { saveData } from "../utils/localStorage";

// ── Icons ─────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 mt-px"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#0A66C2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#0A66C2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 21v-8H7v8M7 3v5h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Reusable card ─────────────────────────────────────────────────────────────

function Card({ icon, title, subtitle, action, children }) {
  return (
    <div className="bg-white border border-warm-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="text-linkedin-500 flex-shrink-0">{icon}</div>
          <div>
            <p className="text-[13.5px] font-semibold text-linkedin-900 leading-tight">
              {title}
            </p>
            <p className="text-[11.5px] text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Profile({
  setPage,
  setGeminiApiKey,
  setResume,
  setLetterTone,
  resume,
  geminiApiKey,
  letterTone,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [form, setForm] = useState({
    geminiApiKey: geminiApiKey || "",
    resume: resume || "",
    letterTone: letterTone || "professional",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const key = form.geminiApiKey.trim();
    const res = form.resume.trim();
    const tone = form.letterTone;

    if (!key) {
      toast.error("API key is required.", TOAST_CONFIG);
      return;
    }

    setIsSaving(true);
    try {
      setResume(res);
      setLetterTone(tone);
      await saveData("resume", res);
      await saveData("geminiApiKey", key);
      await saveData("letterTone", tone);
      setGeminiApiKey(key);
      toast.success("Settings saved successfully.", TOAST_CONFIG);
    } catch {
      toast.error("Save failed. Try again.", TOAST_CONFIG);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    form.geminiApiKey !== (geminiApiKey || "") ||
    form.resume !== (resume || "") ||
    form.letterTone !== (letterTone || "professional");
  const charCount = form.resume.length;
  const charPct = Math.min((charCount / 5000) * 100, 100);
  const charWarn = charCount > 4500;
  const badKey =
    form.geminiApiKey && !form.geminiApiKey.trim().startsWith("AIza");

  return (
    <div className="flex flex-col w-[420px] h-[580px] bg-warm-100 font-sans text-linkedin-900 overflow-hidden">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-warm-200/80 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(PAGES.GENERATOR)}
            className="w-9 h-9 rounded-lg border border-warm-200/80 bg-warm-50/80 text-gray-600 flex items-center justify-center hover:bg-warm-100 hover:text-linkedin-500 hover:border-linkedin-200 transition-all"
            title="Back"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <p className="text-[15px] font-bold text-linkedin-900 tracking-tight leading-tight">
              Settings
            </p>
            <p className="text-[12px] text-gray-500 mt-1 leading-none">
              API key & resume profile
            </p>
          </div>
        </div>
        {hasChanges && (
          <span className="text-[10.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 animate-fade-in">
            ● Unsaved changes
          </span>
        )}
      </header>

      {/* ─── Scrollable form ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <form className="flex flex-col gap-3 px-4 py-2.5" onSubmit={handleSave}>
          {/* API Key Card */}
          <Card
            icon={<KeyIcon />}
            title="Gemini API Key"
            subtitle="Required to generate cover letters"
            action={
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-linkedin-500 hover:text-linkedin-600 whitespace-nowrap mt-0.5 transition-colors"
              >
                Get key <ExternalLinkIcon />
              </a>
            }
          >
            <div className="relative mt-1">
              <input
                id="geminiApiKey"
                name="geminiApiKey"
                type={showKey ? "text" : "password"}
                autoComplete="off"
                placeholder="AIzaSy…"
                value={form.geminiApiKey}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-11 py-2.5 bg-warm-50/80 border border-warm-200/80 rounded-lg text-[13px] text-linkedin-900 placeholder-gray-400 focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-linkedin-500 hover:bg-linkedin-50 transition-colors"
              >
                {showKey ? <EyeOffIcon /> : <EyeOnIcon />}
              </button>
            </div>

            {badKey && (
              <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed flex items-start gap-1.5">
                <span className="mt-0.5">⚠️</span>
                <span>
                  Gemini keys typically start with{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-mono">
                    AIza
                  </code>{" "}
                  — double-check this value.
                </span>
              </div>
            )}
          </Card>

          {/* Resume Card */}
          <Card
            icon={<FileTextIcon />}
            title="Resume"
            subtitle="Personalizes your generated letters"
            action={
              <span
                className={`text-[11px] font-medium whitespace-nowrap mt-1 tabular-nums ${
                  charWarn ? "text-red-500" : "text-gray-400"
                }`}
              >
                {charCount.toLocaleString()} / 5,000
              </span>
            }
          >
            {/* Progress bar */}
            <div className="h-1 bg-warm-200 rounded-full overflow-hidden mt-1 mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  charWarn
                    ? "bg-gradient-to-r from-amber-400 to-red-500"
                    : "bg-gradient-to-r from-linkedin-400 to-linkedin-500"
                }`}
                style={{ width: `${charPct}%` }}
              />
            </div>

            <textarea
              id="resume"
              name="resume"
              rows={7}
              value={form.resume}
              onChange={handleChange}
              placeholder="Paste your full resume here — the more detail, the better your cover letters will be."
              className="w-full px-4 py-2.5 bg-warm-50/80 border border-warm-200/80 rounded-lg text-[13px] text-gray-700 placeholder-gray-400 leading-relaxed resize-y focus:outline-none focus:border-linkedin-500 focus:ring-2 focus:ring-linkedin-500/15 transition-all min-h-[140px]"
            />
          </Card>

          {/* Cover Letter Tone Card */}
          <Card
            icon={<FileTextIcon />}
            title="Letter Tone"
            subtitle="Choose your cover letter style"
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                {
                  value: "professional",
                  label: "Professional",
                  desc: "Formal & structured",
                },
                {
                  value: "enthusiastic",
                  label: "Enthusiastic",
                  desc: "Confident & engaging",
                },
                {
                  value: "technical",
                  label: "Technical Focus",
                  desc: "Skills & achievements",
                },
                {
                  value: "strategic",
                  label: "Strategic",
                  desc: "Impact & leadership",
                },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, letterTone: value }))
                  }
                  className={`p-2.5 rounded-lg border-2 transition-all text-left ${
                    form.letterTone === value
                      ? "border-linkedin-500 bg-linkedin-50"
                      : "border-warm-200 bg-white hover:border-linkedin-300"
                  }`}
                >
                  <p className="text-[12px] font-semibold text-linkedin-900">
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Privacy note */}
          {/* <div className="flex items-start gap-3 px-4 py-3.5 bg-linkedin-50/80 border border-linkedin-100/60 rounded-xl">
            <ShieldIcon />
            <p className="text-[11.5px] text-gray-600 leading-relaxed">
              All data is stored{" "}
              <span className="font-semibold text-linkedin-600">locally</span>{" "}
              in your browser. Nothing is sent anywhere except Gemini when you
              generate.
            </p>
          </div> */}

          {/* Save button */}
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`w-full py-3 rounded-full text-[13px] font-semibold flex items-center justify-center gap-2 transition-all mb-1
              ${
                isSaving || !hasChanges
                  ? "bg-warm-300 text-gray-400 cursor-not-allowed"
                  : "bg-linkedin-500 text-white shadow-md shadow-linkedin-500/25 hover:bg-linkedin-600 active:scale-[0.98]"
              }`}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <SaveIcon />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
