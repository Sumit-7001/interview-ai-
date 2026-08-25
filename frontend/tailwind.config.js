/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // Purple
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        midnight: {
          DEFAULT: '#0D0D11', // Deep black-grey
          light: '#16161F',
          card: '#1F1F2E',
          border: '#2E2E3E',
        },
        cream: {
          DEFAULT: '#FAF9F6', // Warm off-white
          light: '#FFFFFF',
          darker: '#F3F4F6',
          border: '#E5E7EB',
        },
        accent: {
          pink: '#EC4899',
          orange: '#F97316',
          indigo: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px 2px rgba(124, 58, 237, 0.15)',
      }
    },
  },
  plugins: [],
}
