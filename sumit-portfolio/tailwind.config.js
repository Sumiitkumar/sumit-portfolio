/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        primary: '#2563EB',
        secondary: '#0891B2',
        accent: '#7C3AED',
        success: '#10B981',
        muted: '#64748B',
        surface: '#ffffff',
      },
      boxShadow: {
        glow: '0 0 30px rgba(37, 99, 235, 0.14)',
        panel: '0 25px 80px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(37,99,235,0.08), transparent 35%), radial-gradient(circle at 20% 40%, rgba(8,145,178,0.12), transparent 30%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.1), transparent 28%)',
      },
      transitionTimingFunction: {
        'in-out-smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
