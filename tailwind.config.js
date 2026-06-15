/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#151515',
        paper: '#f7f4ee',
        brass: '#bd8b35',
        moss: '#4f6f52',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(21, 21, 21, 0.14)',
      },
    },
  },
  plugins: [],
};
