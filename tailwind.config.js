/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // علشان Tailwind يشتغل على ملفات React
    "./public/index.html",
  ],
  theme: {
        container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sport: ['Anton', 'sans-serif'],
        fantasy: ['fantasy', 'sans-serif'], // define your font
       keyframes: {
      waterFlow: {
        '0%': { backgroundPosition: '0% 0%' },
        '100%': { backgroundPosition: '0% 100%' },
      },
    },
      },
    screens: {
      xs: "320px",
      sm: "375px",
      sml: "500px",
      md: "667px",
      mdl: "768px",
      lg: "660px",
      lgl: "1024px",
      xl: "1280px",
    },  
    },
  },
  plugins: [],
}