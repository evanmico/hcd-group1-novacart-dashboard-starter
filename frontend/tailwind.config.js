/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand:  '#1D4FFF',
        accent: '#00BFA5',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
