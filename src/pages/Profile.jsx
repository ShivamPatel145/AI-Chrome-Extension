import React, { useState } from "react";
import {
  MdArrowBack,
  MdInfoOutline,
  MdLockOutline,
  MdOpenInNew,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { PAGES, TOAST_CONFIG } from "../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { saveData } from "../utils/localStorage";
import { POPUP_THEME } from "../utils/uiTheme";

const t = POPUP_THEME;
const c = t.colors;

function Profile({
  setPage,
  setGeminiApiKey,
  setResume,
  resume,
  geminiApiKey,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [formData, setFormData] = useState({
    geminiApiKey: geminiApiKey || "",
    resume: resume || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const updatedResume = String(formData.resume || "").trim();
    const updatedKey = String(formData.geminiApiKey || "").trim();

    if (!updatedKey) {
      toast.error("API key is required.", TOAST_CONFIG);
      return;
    }

    setIsSaving(true);
    try {
      setResume(updatedResume);
      await saveData("resume", updatedResume);
      await saveData("geminiApiKey", updatedKey);
      setGeminiApiKey(updatedKey);
      toast.success("Settings saved successfully.", TOAST_CONFIG);
    } catch {
      toast.error("Save failed. Try again.", TOAST_CONFIG);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    formData.geminiApiKey !== (geminiApiKey || "") ||
    formData.resume !== (resume || "");

  const charCount = formData.resume.length;
  const charPct = Math.min((charCount / 5000) * 100, 100);
  const charOverLimit = charCount > 4500;

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <button
            type="button"
            style={s.backBtn}
            onClick={() => setPage(PAGES.GENERATOR)}
            title="Back"
            aria-label="Go back"
          >
            <MdArrowBack size={18} />
          </button>
          <div>
            <p style={s.headerTitle}>Settings</p>
            <p style={s.headerSub}>Manage Gemini and resume profile</p>
          </div>
        </div>
        {hasChanges && <span style={s.unsavedBadge}>Unsaved changes</span>}
      </header>

      <div style={s.scrollArea}>
        <form style={s.form} onSubmit={handleSubmit}>
          <section style={s.panel}>
            <div style={s.sectionHead}>
              <div>
                <p style={s.sectionLabel}>Gemini API Key</p>
                <p style={s.sectionDesc}>
                  Used for generating cover letters with Google AI.
                </p>
              </div>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={s.externalLink}
              >
                Get key
                <MdOpenInNew size={13} style={{ marginLeft: 3 }} />
              </a>
            </div>

            <div style={s.inputWrap}>
              <input
                id="geminiApiKey"
                name="geminiApiKey"
                type={showKey ? "text" : "password"}
                autoComplete="off"
                style={s.input}
                placeholder="AIzaSy..."
                value={formData.geminiApiKey}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                style={s.visBtn}
                onClick={() => setShowKey(!showKey)}
                title={showKey ? "Hide key" : "Show key"}
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <MdVisibilityOff size={16} />
                ) : (
                  <MdVisibility size={16} />
                )}
              </button>
            </div>

            {formData.geminiApiKey &&
              !formData.geminiApiKey.trim().startsWith("AIza") && (
                <div style={s.hintWarn}>
                  <MdInfoOutline size={14} style={{ flexShrink: 0 }} />
                  <p style={s.hintWarnText}>
                    Gemini API keys typically start with "AIza".
                  </p>
                </div>
              )}
          </section>

          <section style={s.panel}>
            <div style={s.sectionHead}>
              <div>
                <p style={s.sectionLabel}>Resume</p>
                <p style={s.sectionDesc}>
                  Personalizes your generated cover letters.
                </p>
              </div>
              <span style={charOverLimit ? s.charCountWarn : s.charCount}>
                {charCount.toLocaleString()} chars
              </span>
            </div>

            <div style={s.progressTrack}>
              <div
                style={{
                  ...s.progressFill,
                  width: `${charPct}%`,
                  background: charOverLimit
                    ? "linear-gradient(90deg, #f59e0b, #ea580c)"
                    : `linear-gradient(90deg, ${c.accent}, ${c.accentDark})`,
                }}
              />
            </div>

            <textarea
              id="resume"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              rows={9}
              style={s.textarea}
              placeholder="Paste your full resume here - the more detail, the more tailored your cover letters will be."
            />
          </section>

          <div style={s.privacyCard}>
            <MdLockOutline size={14} style={s.privacyIcon} />
            <p style={s.privacyText}>
              All data is stored locally in your browser. Nothing is sent to any
              server except the Gemini API when you generate.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            style={
              isSaving || !hasChanges
                ? { ...s.saveBtn, ...s.saveBtnOff }
                : s.saveBtn
            }
          >
            {isSaving ? (
              <>
                <span style={s.spin} />
                Saving...
              </>
            ) : (
              <>
                <MdSave size={15} style={{ marginRight: 7 }} />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>

      <ToastContainer />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        #geminiApiKey::placeholder,
        #resume::placeholder {
          color: #94a3b8;
        }
        #geminiApiKey:focus, #resume:focus {
          outline: none;
          border-color: ${c.accentBorder};
          box-shadow: 0 0 0 3px rgba(20, 99, 255, 0.12);
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
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
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  backBtn: {
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
  headerTitle: {
    margin: 0,
    fontSize: 13.6,
    fontWeight: 600,
    color: c.textPrimary,
    letterSpacing: "-0.01em",
    lineHeight: 1,
  },
  headerSub: {
    margin: "4px 0 0",
    fontSize: 11,
    color: c.textMuted,
    lineHeight: 1,
  },
  unsavedBadge: {
    fontSize: 10.8,
    fontWeight: 600,
    color: c.warning,
    background: c.warningSoft,
    border: `1px solid ${c.warningBorder}`,
    borderRadius: 20,
    padding: "3px 9px",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "14px 14px 8px",
    gap: 10,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: t.radius,
    padding: "12px",
    boxShadow: t.shadows.panel,
  },
  sectionHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  sectionLabel: {
    margin: 0,
    fontSize: 13.2,
    fontWeight: 600,
    color: c.textPrimary,
    letterSpacing: "-0.01em",
  },
  sectionDesc: {
    margin: "2px 0 0",
    fontSize: 11.5,
    color: c.textMuted,
    lineHeight: 1.4,
  },
  externalLink: {
    fontSize: 11,
    fontWeight: 600,
    color: c.accent,
    textDecoration: "none",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    marginTop: 2,
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "10px 40px 10px 12px",
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    fontSize: 13,
    color: c.textPrimary,
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  },
  visBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: c.surfaceMuted,
    border: `1px solid ${c.border}`,
    color: c.textMuted,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    padding: 0,
    borderRadius: 7,
  },
  hintWarn: {
    margin: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    fontSize: 11,
    color: c.warning,
    background: c.warningSoft,
    border: `1px solid ${c.warningBorder}`,
    borderRadius: 8,
    padding: "6px 8px",
  },
  hintWarnText: {
    margin: 0,
    lineHeight: 1.45,
  },
  charCount: {
    fontSize: 11.5,
    color: c.textMuted,
    whiteSpace: "nowrap",
    marginTop: 2,
  },
  charCountWarn: {
    fontSize: 11.5,
    color: c.warning,
    fontWeight: 600,
    whiteSpace: "nowrap",
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    background: "#edf2f7",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: -2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.3s ease",
  },
  textarea: {
    width: "100%",
    minHeight: 176,
    padding: "10px 12px",
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    fontSize: 12.5,
    color: c.textSecondary,
    fontFamily: "inherit",
    lineHeight: 1.65,
    resize: "vertical",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  },
  privacyCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    padding: "10px 11px",
    background: c.surfaceMuted,
    border: `1px solid ${c.border}`,
    borderRadius: 11,
    marginTop: 2,
  },
  privacyIcon: {
    color: c.textMuted,
    flexShrink: 0,
    marginTop: 1,
  },
  privacyText: {
    margin: 0,
    fontSize: 11,
    color: c.textMuted,
    lineHeight: 1.55,
  },
  saveBtn: {
    marginTop: 2,
    marginBottom: 2,
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
    gap: 7,
    letterSpacing: "-0.01em",
    boxShadow: t.shadows.button,
  },
  saveBtnOff: {
    background: "#e9eef5",
    color: c.textMuted,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spin: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
  },
};

export default Profile;
