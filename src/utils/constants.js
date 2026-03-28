export const PAGES = {
  GENERATOR: "GENERATOR",
  PROFILE: "PROFILE",
};

export const TOAST_CONFIG = {
  position: "bottom-center",
  autoClose: 1800,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "light",
  style: {
    fontSize: "13px",
    borderRadius: "8px",
    padding: "8px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export const API_CONFIG = {
  GEMINI_BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models",
  GEMINI_MODELS: ["gemini-2.5-flash", "gemini-2.0-flash"],
  GEMINI_TIMEOUT_MS: 30000,
};
