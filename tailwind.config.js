/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B93325",
          hover: "#9E2A1E",
          dark: {
            accent: "#E57368",
            DEFAULT: "#B93325",
            hover: "#EF5350",
            bg: "#161313",
            surface: "#211C1C",
            elevated: "#2C2626",
            border: "#3D3535",
            text: "#F5F3F3",
            muted: "#A89F9E",
          },
        },
      },
    },
  },
  plugins: [],
};
