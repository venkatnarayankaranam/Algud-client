/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary grayscale mapping for a premium black-and-white theme
        primary: {
          50: '#ffffff',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a8a8a8',
          500: '#7a7a7a',
          600: '#3a3a3a',
          700: '#1a1a1a',
          800: '#0f0f0f',
          900: '#000000',
        },
        // Keep a named charcoal set for convenience
        charcoal: {
          900: '#000000',
          800: '#111111',
          700: '#1a1a1a',
          600: '#202020',
        },
        // Gold accent reserved only for minimal highlights
        gold: {
          500: '#d4af37', // royal gold accent
        },
        // Light neutrals
        ivory: {
          50: '#ffffff',
          100: '#f5f5f5',
          200: '#e5e5e5',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        goldGlow: '0 10px 25px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        // Custom subtle slow spin for the cart icon (3s linear infinite)
        'spin-slow': 'spinSlow 3s linear infinite',
        // Hero text entrance animation
        'hero-in': 'heroIn 900ms cubic-bezier(.22,.9,.32,1) both',
        // Cinematic line reveal for headline
        'cinematic-reveal': 'cinematicReveal 1100ms cubic-bezier(.22,.9,.32,1) both'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
        ,
        // 360deg rotation for cart icon
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
        ,
        // Smooth slide-up + fade for hero text
        heroIn: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '60%': { opacity: '0.6', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
        ,
        cinematicReveal: {
          '0%': { opacity: '0', transform: 'translateY(36px) scale(0.98)', filter: 'blur(6px) saturate(0.8) brightness(0.8)' },
          '60%': { opacity: '0.8', transform: 'translateY(8px) scale(0.995)', filter: 'blur(2px) saturate(0.95) brightness(0.92)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0px) saturate(1) brightness(1)' },
        }
      }
    },
    },
    plugins: [],
}
