/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to prevent conflicts with Ant Design
  },
  important: true, // Make Tailwind styles have higher specificity
  theme: {
    extend: {},
  },
  plugins: [],
}
