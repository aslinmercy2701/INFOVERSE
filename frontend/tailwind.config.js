/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-red': '#ff0022',
        'crimson': '#dc143c',
        'dark-bg': '#0a0a0a',
        'dark-card': '#111111',
        'dark-border': '#1a1a1a',
        'charcoal': '#222222',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 34, 0.5)',
        'neon-lg': '0 0 40px rgba(255, 0, 34, 0.3)',
        'neon-sm': '0 0 10px rgba(255, 0, 34, 0.4)',
      },
      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 34, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 34, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}
