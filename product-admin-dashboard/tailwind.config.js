/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F5F1',
        surface: '#FFFFFF',
        ink: '#16211C',
        muted: '#5E6B64',
        line: '#DCE0D8',
        brand: { DEFAULT: '#1E5B47', dark: '#164536', soft: '#E6F0EA' },
        danger: '#B3261E',
        warn: '#9A5B00',
      },
    },
  },
  plugins: [],
};
