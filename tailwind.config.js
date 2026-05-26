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
          primary: '#4B2E83',
          secondary: '#A88FCF',
          gold: '#D4AF37',
          sage: '#5E6B5A',
          mist: '#E8EFE9',
          pale: '#f3eeff',
          charcoal: '#1F2933',
          warm: '#F5F6F8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        brand: ['Cinzel', 'Georgia', 'serif'],
      },
      animation: {
        'scan-line': 'scan-line 2s ease-in-out infinite',
      },
      keyframes: {
        'scan-line': {
          '0%, 100%': { top: '8%', opacity: '1' },
          '50%':       { top: '88%', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
