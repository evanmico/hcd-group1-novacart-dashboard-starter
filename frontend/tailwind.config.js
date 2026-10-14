/** @type {import('tailwindcss').Config} */
// Theme tokens point at the CSS variables in src/App.css, so the light/dark
// switch (data-theme="dark" on <html>) keeps working with Tailwind utilities.
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        page:    'var(--bg-primary)',
        card:    'var(--bg-card)',
        ink:     'var(--text-primary)',
        ink2:    'var(--text-secondary)',
        muted:   'var(--text-muted)',
        line:    'var(--border)',
        accent:  'var(--accent)',
        brand:   'var(--blue)',
        sidebar: 'var(--sidebar)',
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
      borderRadius: { card: 'var(--radius)' },
      boxShadow:    { card: 'var(--shadow)' },
    },
  },
  plugins: [],
};
