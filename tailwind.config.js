/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#f0fafa',
          100: '#d0f0f0',
          200: '#a1e2e2',
          300: '#67cece',
          400: '#36b5b5',
          500: '#006D77',
          600: '#005d65',
          700: '#004d54',
          800: '#003c42',
          900: '#002c30',
        },
        gold: {
          50:  '#fdfaef',
          100: '#f7eecd',
          200: '#f0dc96',
          300: '#e6c45a',
          400: '#D4AF37',
          500: '#c09a22',
          600: '#a07e18',
          700: '#7e6214',
          800: '#5c4710',
          900: '#3a2d0a',
        },
        sand: {
          50: '#fdfaf5',
          100: '#F8F5F0',
          200: '#f0e8d8',
          300: '#e5d4b8',
          400: '#d4ba90',
          500: '#c09a68',
        },
        burgundy: {
          500: '#8B1A1A',
          600: '#7a1616',
          700: '#631212',
        }
      },
      fontFamily: {
        arabic: ['"Noto Naskh Arabic"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'geometric': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
