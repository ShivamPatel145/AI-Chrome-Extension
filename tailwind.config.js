/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      linkedin: {
        50: "#EEF3F8",
        100: "#D0E0F0",
        200: "#A8C7E8",
        300: "#70A9DC",
        400: "#378FD2",
        500: "#0A66C2",
        600: "#004182",
        700: "#00325E",
        800: "#1B1F23",
        900: "#191919",
      },
      warm: {
        50: "#F9FAFB",
        100: "#F3F2EF",
        200: "#E8E6E1",
        300: "#DDDAD5",
        400: "#C7C4BF",
      },
    },
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
      },
      fadeIn: {
        from: { opacity: "0", transform: "translateY(6px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
    },
    animation: {
      shimmer: "shimmer 1.4s linear infinite",
      "fade-in": "fadeIn 0.25s ease forwards",
    },
  },
};
export const plugins = [];
