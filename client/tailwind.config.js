/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f2f7f2",
          100: "#dfeee1",
          200: "#b6d8bb",
          300: "#8ec198",
          400: "#5e9f6a",
          500: "#3f7f4d",
          600: "#2f6a3e",
          700: "#255534",
          800: "#1f452b",
          900: "#183723"
        }
      }
    }
  },
  plugins: []
}
