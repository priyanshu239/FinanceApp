/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50:  '#faf8f3',
          100: '#f5f1e8',
          200: '#ede8dc',
          300: '#e0d9c8',
          400: '#cdc3ab',
          500: '#b5a88e',
          600: '#9a8b72',
          700: '#7d6f58',
          800: '#5c5040',
          900: '#3a3128',
        },
        ink: {
          DEFAULT: '#0f0e0b',
          light: '#3a3630',
          muted: '#7a7368',
          faint: '#b0a89c',
        },
        accent: {
          green: '#2d6a4f',
          red:   '#b5291c',
          amber: '#b57a1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        '4xl': '2rem',
      },
      boxShadow: {
        'paper': '2px 4px 0px 0px rgba(15,14,11,0.12)',
        'paper-md': '3px 6px 0px 0px rgba(15,14,11,0.15)',
        'paper-lg': '4px 8px 0px 0px rgba(15,14,11,0.20)',
        'inset-paper': 'inset 0 1px 3px rgba(15,14,11,0.08)',
      },
    },
  },
  plugins: [],
}
