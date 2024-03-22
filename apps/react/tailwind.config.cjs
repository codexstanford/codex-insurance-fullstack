/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
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
