/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zariya: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
          'surface-soft': '#F4F0EB',
          primary: '#141210',
          secondary: '#3D3833',
          muted: '#6E675F',
          accent: '#C59B27',
          'accent-hover': '#9E7A18',
          border: '#E7E2DA',
          error: '#991B1B',
          success: '#166534',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
