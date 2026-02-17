/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
          colors: {
      "brand-orange": "#F15A29",
      "brand-navy": "#0B1B3A",
      "brand-blue": "#2563EB",
      "brand-light-blue": "#EAF3FF",
      "brand-accent-blue": "#93C5FD",
    },
    },
  },
  plugins: [],
}

