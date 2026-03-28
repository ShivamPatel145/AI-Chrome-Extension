import React, { useEffect, useState } from "react";
import {
  MdAutoAwesome,
  MdCheck,
  MdContentCopy,
  MdInfoOutline,
  MdOutlineErrorOutline,
  MdOutlineRocketLaunch,
  MdSettings,
} from "react-icons/md";
import { PAGES } from "../utils/constants";
import { loadData } from "../utils/localStorage";
import { postGeminiMessage } from "../utils/geminiApi";
import { POPUP_THEME } from "../utils/uiTheme";

const t = POPUP_THEME;
const c = t.colors;

function CoverLetterGenerator({ setPage, resume, geminiApiKey }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadData("jobDescription")
      .then((d) => {
        if (isMounted) setJobDescription(d || "");
      })
      .catch(console.error);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const generateCoverLetter = async () => {
    if (isLoading) return;
    const trimmedResume = resume?.trim();
    const trimmedKey = geminiApiKey?.trim();
    const trimmedDesc = jobDescription?.trim();

    if (!trimmedKey)
      return setErrorMessage("Add your Gemini API key in Settings first.");
    if (!trimmedResume)
      return setErrorMessage("Add your resume in Settings first.");
    if (!trimmedDesc)
      return setErrorMessage(
        "No job description found. Open a job post and retry.",
      );

    setErrorMessage("");
    setIsLoading(true);
    setCoverLetter("");
    setCopied(false);

    try {
      const msg = `Generate a concise, professional cover letter based on the following resume and job description. Make it personalized, compelling, and ready to use.\n\nRESUME:\n${trimmedResume}\n\nJOB DESCRIPTION:\n${trimmedDesc}`;
      const result = await postGeminiMessage(msg, trimmedKey);
      setCoverLetter(result);
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
      setErrorMessage("Failed to copy to clipboard.");
    }
  };

  const missingKey = !geminiApiKey?.trim();
  const missingResume = !resume?.trim();
  const showNudge = (missingKey || missingResume) && !errorMessage;
  const statusText = isLoading
    ? "Generating"
    : coverLetter
      ? "Ready"
      : "Awaiting input";

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.brandRow}>
          <div style={s.brandIconWrap}>
            <MdOutlineRocketLaunch size={15} />
          </div>
          <div>
            <p style={s.brandTitle}>Cover Letter AI</p>
            <p style={s.brandSub}>LinkedIn to tailored draft</p>
          </div>
        </div>
        <button
          style={s.iconBtn}
          onClick={() => setPage(PAGES.PROFILE)}
          title="Settings"
          aria-label="Open settings"
        >
          <MdSettings size={18} />
        </button>
      </header>

      {showNudge && (
        <div style={s.nudge}>
          <MdInfoOutline size={16} style={s.nudgeIcon} />
          <span style={s.nudgeText}>
            {missingKey && missingResume
              ? "Set up your API key and resume to get started."
              : missingKey
                ? "Add your Gemini API key in Settings."
                : "Paste your resume in Settings to personalize output."}
          </span>
          <button
            type="button"
            style={s.nudgeAction}
            onClick={() => setPage(PAGES.PROFILE)}
          >
            Open
          </button>
        </div>
      )}

      {errorMessage && (
        <div style={s.errorBanner}>
          <MdOutlineErrorOutline size={15} style={s.errorIcon} />
          <span style={s.errorText}>{errorMessage}</span>
          <button
            type="button"
            style={s.errorClose}
            onClick={() => setErrorMessage("")}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      <section style={s.panel}>
        <div style={s.panelHeader}>
          <div style={s.statusWrap}>
            <div
              style={{
                ...s.statusDot,
                background: isLoading
                  ? c.warning
                  : coverLetter
                    ? c.success
                    : c.borderStrong,
                boxShadow: isLoading
                  ? "0 0 0 3px rgba(217, 119, 6, 0.15)"
                  : coverLetter
                    ? "0 0 0 3px rgba(15, 159, 110, 0.12)"
                    : "none",
              }}
            />
            <span style={s.statusText}>{statusText}</span>
          </div>

          {coverLetter && (
            <button
              type="button"
              style={copied ? { ...s.copyBtn, ...s.copyBtnActive } : s.copyBtn}
              onClick={copyToClipboard}
              aria-label="Copy generated letter"
            >
              {copied ? (
                <>
                  <MdCheck size={13} style={{ marginRight: 4 }} />
                  Copied
                </>
              ) : (
                <>
                  <MdContentCopy size={13} style={{ marginRight: 4 }} />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        <div style={s.panelBody}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : coverLetter ? (
            <p style={s.outputText}>{coverLetter}</p>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <div style={s.footer}>
        <button
          type="button"
          disabled={isLoading}
          onClick={generateCoverLetter}
          style={isLoading ? { ...s.btn, ...s.btnOff } : s.btn}
        >
          {isLoading ? (
            <>
              <span style={s.spin} />
              Generating...
            </>
          ) : (
            <>
              <MdAutoAwesome size={16} style={{ marginRight: 6 }} />
              Generate Cover Letter
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

function LoadingSkeleton() {
  const bars = [100, 82, 96, 70, 88, 60, 94];
  return (
    <div style={s.skeletonWrap}>
      {bars.map((w, i) => (
        <div
          key={i}
          style={{
            height: 11,
            width: `${w}%`,
            borderRadius: 5,
            background:
              "linear-gradient(90deg, #eef2f7 25%, #dde4ee 50%, #eef2f7 75%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.4s linear ${i * 0.08}s infinite`,
          }}
        />
      ))}
      <p style={s.skeletonCaption}>Crafting your letter...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={s.emptyState}>
      <div style={s.emptyIconWrap}>
        <MdAutoAwesome size={22} color={c.accent} />
      </div>
      <p style={s.emptyTitle}>Ready to generate</p>
      <p style={s.emptyCopy}>
        Open a LinkedIn job posting, then generate a tailored, copy-ready cover
        letter here.
      </p>
      <div style={s.stepList}>
        {[
          ["1", "Open a LinkedIn job listing"],
          ["2", "Return and click Generate"],
          ["3", "Copy and send your letter"],
        ].map(([num, label]) => (
          <div key={num} style={s.stepItem}>
            <span style={s.stepBadge}>{num}</span>
            <span style={s.stepLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: t.width,
    height: t.height,
    background:
      "radial-gradient(circle at top right, #f8fbff 0%, #f4f7fb 38%, #edf2f9 100%)",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    color: c.textPrimary,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px 12px",
    background: "rgba(255, 255, 255, 0.74)",
    borderBottom: `1px solid ${c.border}`,
    flexShrink: 0,
    backdropFilter: "blur(4px)",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10 },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: `linear-gradient(145deg, ${c.accent} 0%, ${c.accentDark} 100%)`,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: t.shadows.button,
  },
  brandTitle: {
    margin: 0,
    fontSize: 13.5,
    fontWeight: 600,
    color: c.textPrimary,
    letterSpacing: "-0.01em",
    lineHeight: 1,
  },
  brandSub: {
    margin: "4px 0 0",
    fontSize: 11,
    color: c.textMuted,
    lineHeight: 1,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${c.border}`,
    background: c.surface,
    color: c.textSecondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",
  },
  nudge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "11px 14px 0",
    padding: "10px 11px",
    background: c.accentSoft,
    border: `1px solid ${c.accentBorder}`,
    borderRadius: 11,
    flexShrink: 0,
  },
  nudgeIcon: { color: c.accent, flexShrink: 0 },
  nudgeText: { flex: 1, fontSize: 11.5, color: c.accentDark, lineHeight: 1.5 },
  nudgeAction: {
    fontSize: 11.5,
    fontWeight: 600,
    color: c.accent,
    background: c.surface,
    border: `1px solid ${c.accentBorder}`,
    borderRadius: 8,
    padding: "4px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  errorBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    margin: "8px 14px 0",
    padding: "9px 10px",
    background: c.dangerSoft,
    border: `1px solid ${c.dangerBorder}`,
    borderRadius: 11,
    flexShrink: 0,
  },
  errorIcon: { color: c.danger, flexShrink: 0, marginTop: 1 },
  errorText: { flex: 1, fontSize: 11.8, color: c.danger, lineHeight: 1.5 },
  errorClose: {
    border: "none",
    background: "transparent",
    color: c.danger,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    padding: "1px 2px",
  },
  panel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    margin: "11px 14px 10px",
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: t.radius,
    boxShadow: t.shadows.panel,
    overflow: "hidden",
    minHeight: 0,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 13px",
    borderBottom: `1px solid ${c.border}`,
    background: c.surfaceMuted,
    flexShrink: 0,
  },
  statusWrap: { display: "flex", alignItems: "center", gap: 7 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "all 0.35s ease",
  },
  statusText: {
    fontSize: 10.8,
    fontWeight: 600,
    color: c.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 500,
    color: c.textSecondary,
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "5px 9px",
    cursor: "pointer",
  },
  copyBtnActive: {
    color: c.success,
    background: "#effcf6",
    border: "1px solid #b3f0d4",
  },
  panelBody: {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  },
  outputText: {
    padding: "15px 15px 18px",
    fontSize: 12.5,
    color: c.textSecondary,
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    margin: 0,
    fontWeight: 400,
    animation: "rise 0.2s ease",
    letterSpacing: "0.01em",
  },
  skeletonWrap: {
    padding: "18px 15px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  skeletonCaption: {
    margin: "11px 0 0",
    fontSize: 11,
    color: c.textMuted,
    textAlign: "center",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 20px",
    textAlign: "center",
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: c.accentSoft,
    border: `1px solid ${c.accentBorder}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    margin: "0 0 6px",
    fontSize: 14,
    fontWeight: 600,
    color: c.textPrimary,
    letterSpacing: "-0.01em",
  },
  emptyCopy: {
    margin: "0 0 18px",
    fontSize: 12,
    color: c.textMuted,
    lineHeight: 1.6,
    maxWidth: 220,
  },
  stepList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    maxWidth: 235,
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    textAlign: "left",
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: c.accentSoft,
    color: c.accent,
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: `1px solid ${c.accentBorder}`,
  },
  stepLabel: {
    fontSize: 12,
    color: c.textMuted,
  },
  footer: {
    padding: "0 14px 14px",
    flexShrink: 0,
  },
  btn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 11,
    border: "none",
    background: `linear-gradient(145deg, ${c.accent} 0%, ${c.accentDark} 100%)`,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "-0.01em",
    boxShadow: t.shadows.button,
  },
  btnOff: {
    background: "#e9eef5",
    color: c.textMuted,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spin: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid rgba(255, 255, 255, 0.28)",
    borderTopColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
    marginRight: 8,
  },
};

export default CoverLetterGenerator;
