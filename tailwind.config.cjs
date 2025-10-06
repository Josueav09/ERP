/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A332C',
        'primary-dark': '#07221c',
        secondary: '#B5E385',
        'secondary-light': '#C9E993'
      }
    }
  },
  plugins: []
}
