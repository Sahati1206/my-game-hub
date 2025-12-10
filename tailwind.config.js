/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        'primary': '#00BFFF',        // Cyber Blue
        'secondary': '#0A192F',      // Deep Navy
        'accent': '#7B61FF',         // Electric Purple
        'neutral-light': '#E6E6E6',  // Soft Gray
        'neutral-dark': '#1C1C1C',   // Charcoal

        // Status Colors
        'success': '#00FF9C',        // Neon Green
        'error': '#FF4C4C',          // Alert Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundColor: theme => ({
        ...theme('colors'),
        'page': '#0A192F',           // Default page background
        'card': '#1C1C1C',           // Card background
      }),
      textColor: theme => ({
        ...theme('colors'),
        'primary': '#E6E6E6',        // Default text
        'muted': '#A0A0A0',          // Muted text
      }),
    },
  },
  plugins: [],
}