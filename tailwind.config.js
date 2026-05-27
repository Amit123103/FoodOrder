/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        brown: {
          dark: '#2C1810',
          golden: '#8B5E1A',
        },
        orange: {
          primary: '#E8864A',
        },
        green: {
          dark: '#2D5016',
          sage: '#4A5D4E',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        lato: ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
