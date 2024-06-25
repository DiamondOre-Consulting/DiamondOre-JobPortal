/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '412px',   
      },
      maxWidth: {
        'xxs': '412px',
      },
      colors: {
        'bgcolor': '#D7CCC1',
        'profilecolor' : '#F4ECE6'
      },
    },
  },
  plugins: [],
}
