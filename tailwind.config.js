/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark terminal palette (matching GitHub profile aesthetic)
        surface: {
          DEFAULT: '#0d1117',
          raised: '#161b22',
          overlay: '#1c2128',
          border: '#30363d',
        },
        accent: {
          DEFAULT: '#58A6FF',
          hover: '#79C0FF',
          muted: '#388BFD',
          subtle: '#58A6FF1a',
        },
        text: {
          primary: '#F0F6FC',
          secondary: '#8B949E',
          muted: '#6E7681',
          link: '#58A6FF',
        },
        glow: {
          blue: '#58A6FF33',
          green: '#3FB95033',
          purple: '#A371F733',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'draw-line': 'drawLine 2s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, #30363d 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-md': '32px 32px',
      },
    },
  },
  plugins: [],
};
