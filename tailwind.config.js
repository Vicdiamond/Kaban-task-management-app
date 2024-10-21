/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        purple: '0 0 0 #b3b3b3'
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(255, 99, 71, 0.5)', // light tomato shadow
        'custom-dark': '0 10px 15px rgba(0, 0, 0, 0.8)' // dark shadow
      }
    }
  },
  plugins: []
}
