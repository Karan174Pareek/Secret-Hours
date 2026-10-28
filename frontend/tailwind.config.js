/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secret: {
          midnight: '#1D1B1A',
          ivory: '#F7F4EF',
          champagne: '#E9DFD2',
          mocha: '#78645D',
          primary: '#1D1B1A',
          surface: '#FFFFFF',
          'surface-soft': '#F7F4EF',
          secondary: '#78645D',
          border: '#E9DFD2',
        },
        zariya: {
          bg: '#F7F4EF',
          surface: '#FFFFFF',
          'surface-soft': '#E9DFD2',
          primary: '#1D1B1A',
          secondary: '#78645D',
          muted: '#78645D',
          accent: '#1D1B1A',
          'accent-hover': '#78645D',
          border: '#E9DFD2',
          error: '#991B1B',
          success: '#166534',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        couture: '0.25em',
        editorial: '0.15em',
      },
      boxShadow: {
        'luxury-sm': '0 2px 8px -2px rgba(20, 18, 16, 0.05)',
        'luxury-md': '0 8px 24px -4px rgba(20, 18, 16, 0.08)',
        'luxury-lg': '0 16px 48px -8px rgba(20, 18, 16, 0.12)',
        'zari-glow': '0 0 25px rgba(197, 155, 39, 0.25)',
      },
      transitionTimingFunction: {
        'couture': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
