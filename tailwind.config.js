/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#06b6d4",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        clubsphere: {
          primary: "#2563eb",
          secondary: "#7c3aed",
          accent: "#06b6d4",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "dark",
    ],
  },
}
