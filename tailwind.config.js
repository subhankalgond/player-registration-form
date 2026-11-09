/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F1EFE8',
          50: '#FAF8F4',
          100: '#F1EFE8',
          200: '#E4E0D5',
        },
        nearblack: {
          DEFAULT: '#17191A',
          800: '#232628',
          900: '#17191A',
        },
        yellow: {
          accent: '#F4D85A',
        },
        orange: {
          accent: '#E66A32',
        },
        blue: {
          cobalt: '#315BD6',
        },
        grey: {
          light: '#D8D7D0',
          concrete: '#A8A69E',
        },
        green: {
          deep: '#236B45',
        },
        red: {
          brick: '#B43C32',
        }
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        signature: ['"Caveat"', '"Permanent Marker"', 'cursive'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #17191A',
        'brutal-lg': '6px 6px 0px #17191A',
        'brutal-sm': '2px 2px 0px #17191A',
        'brutal-orange': '4px 4px 0px #E66A32',
        'brutal-yellow': '4px 4px 0px #F4D85A',
        'brutal-red': '4px 4px 0px #B43C32',
      }
    },
  },
  plugins: [],
}

