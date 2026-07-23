/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: '#020617',
          dark: '#0f172a',
          primary: '#3b82f6',
          secondary: '#2563eb',
          accent: '#1e1b4b',
        },
        insta: {
          pink: '#e1306c',
          purple: '#833ab4',
          orange: '#f77737',
        },
        tiktok: {
          cyan: '#25f4ee',
          red: '#fe2c55',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
        'float-medium': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 15s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
