/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        traffic: {
          green: '#22c55e',
          yellow: '#eab308',
          orange: '#f97316',
        },
        brand: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          light: '#ede9fe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
