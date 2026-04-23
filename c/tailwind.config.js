// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF0800",
        secondary: "#1B1B1B",
        bgLight: "#F0F8FF",
      },
      fontFamily: {
        logo: ['"Fuzzy Bubbles"', "sans-serif"],
        button: ['"Fuzzy Bubbles"', "sans-serif"],
        sans: ['"Fuzzy Bubbles"', "sans-serif"],
      },
      fontWeight: {
        logo: "700",
      },
    },
  },
  plugins: [],
};
