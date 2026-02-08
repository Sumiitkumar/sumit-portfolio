/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        green: {
          light: '#6EE7B7',
          DEFAULT: '#22C55E',
          dark: '#065F46',
        },
        white: '#FFFFFF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};