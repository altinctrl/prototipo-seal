/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sealog: {
          blue: {
            DEFAULT: '#001158',
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#0a2282',
            900: '#001158',
            950: '#000c3b',
          },
          cream: {
            DEFAULT: '#fdfaee',
            50: '#ffffff',
            100: '#fdfaee',
            200: '#f7f2dc',
            300: '#ece5c3',
            400: '#ded3a5',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
