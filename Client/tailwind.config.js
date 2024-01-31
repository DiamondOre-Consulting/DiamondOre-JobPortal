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
    },
  },
  plugins: [],
}