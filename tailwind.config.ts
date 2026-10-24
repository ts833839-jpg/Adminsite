import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Indian luxury palette
        maroon: {
          50: '#FBF4F5',
          100: '#F5E6E8',
          200: '#EBCFD3',
          300: '#DBABB1',
          400: '#C27581',
          500: '#A44555',
          600: '#8A3241',
          700: '#67121D', // Rich Maroon
          800: '#4A0E17', // Deep Royal Burgundy
          900: '#380B12', // Wine
          950: '#22050B', // Deepest Wine
        },
        gold: {
          50: '#FDFBF5',
          100: '#FBF5E5',
          200: '#F5E6BF',
          300: '#EBD190',
          400: '#E0BC5B',
          500: '#D4AF37', // Antique Gold
          600: '#C59B27', // Rich Gold
          700: '#A07A19',
          800: '#7E5F17',
          900: '#644A16',
          champagne: '#F3E5AB',
        },
        ivory: {
          50: '#FEFDFB',
          100: '#FDFBF7', // Warm Ivory
          200: '#FAF6F0',
          300: '#F5EFEB', // Soft Beige
          400: '#EAE1D7',
          500: '#D9CEC3',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#2A2628',
          900: '#181617', // Deep Charcoal
          950: '#100E0F',
        },
        rose: {
          muted: '#C98A90',
          deep: '#9E5D65',
        },
        sand: {
          DEFAULT: '#E8DFD8',
          dark: '#D9CEC5',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 10px 30px -10px rgba(56, 11, 18, 0.15), 0 4px 6px -2px rgba(212, 175, 55, 0.05)',
        'royal-lg': '0 20px 40px -15px rgba(56, 11, 18, 0.25), 0 0 15px 1px rgba(212, 175, 55, 0.12)',
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #380B12 0%, #4A0E17 50%, #22050B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #C59B27 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FDFBF7 0%, #FAF6F0 100%)',
        'dark-royal': 'linear-gradient(180deg, #181617 0%, #22050B 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
