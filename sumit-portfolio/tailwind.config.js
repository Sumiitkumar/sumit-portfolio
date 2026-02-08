/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e', // green-500
        },
        background: {
          DEFAULT: '#fff',
        },
      },
    },
  },
  plugins: [],
}