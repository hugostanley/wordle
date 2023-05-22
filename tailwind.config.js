/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#121312',
        'graydark': '#3A3B3D',
        'graylight': '#818285'
      }
    },
  },
  plugins: [],
}

