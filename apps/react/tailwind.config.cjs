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
          200: "rgb(204,217,248)",
        },
      },
    },
  },
  plugins: [],
};
