/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        blue: {
          200: "rgba(0, 64, 221, 0.2)",
        },
      },
    },
  },
  plugins: [],
};
