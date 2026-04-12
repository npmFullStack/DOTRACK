// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#FBBF24",
                secondary: "#374151",
            },
            fontFamily: {
                logo: ['"Caveat"', "cursive"],
                button: ['"Funnel Sans"', "sans-serif"],
                sans: ['"Funnel Sans"', "sans-serif"],
            },
            fontWeight: {
                logo: '900',
            }
        }
    },
    plugins: []
};