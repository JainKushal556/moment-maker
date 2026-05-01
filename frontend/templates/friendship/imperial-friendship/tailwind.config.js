/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyan-500': '#00b7d7',
        'pink-500': '#f6339a',
      },
    },
  },
  plugins: [],
}
