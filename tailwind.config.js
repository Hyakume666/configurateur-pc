/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          950: '#05060a',
          900: '#0a0d14',
          800: '#10141f',
          700: '#171c2b',
          600: '#1e2438'
        },
        primary: {
          50: '#e6f7ff',
          100: '#b3e7ff',
          200: '#80d6ff',
          300: '#4dc6ff',
          400: '#1ab5ff',
          500: '#00a3ff',
          600: '#0084d1',
          700: '#0066a3',
          800: '#004775',
          900: '#002947'
        },
        neon: {
          blue: '#00e5ff',
          violet: '#a855f7',
          pink: '#ff2bd6',
          green: '#39ff14',
          yellow: '#fdf500'
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
          dim: '#64748b'
        },
        border: {
          subtle: '#1f2937',
          default: '#334155',
          strong: '#475569'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 229, 255, 0.45), 0 0 40px rgba(0, 229, 255, 0.2)',
        'neon-violet': '0 0 20px rgba(168, 85, 247, 0.45), 0 0 40px rgba(168, 85, 247, 0.2)',
        'neon-pink': '0 0 20px rgba(255, 43, 214, 0.45), 0 0 40px rgba(255, 43, 214, 0.2)',
        'glow-soft': '0 0 30px rgba(0, 163, 255, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)'
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-hero': 'radial-gradient(ellipse at top, rgba(0,163,255,0.18), transparent 60%), radial-gradient(ellipse at bottom right, rgba(168,85,247,0.12), transparent 50%)'
      },
      backgroundSize: {
        'grid-lg': '60px 60px'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 255, 0.7)' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'particles-drift': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(-40px) translateX(20px)' }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'particles-drift': 'particles-drift 12s ease-in-out infinite alternate'
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: []
}
