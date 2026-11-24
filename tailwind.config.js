module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#060609', 900: '#0c0c12', 800: '#14141c' },
        lime: { DEFAULT: '#bfff3c' },
        violet: { DEFAULT: '#8b7cff' },
        muted: '#9c9ca8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 44px -12px rgba(191, 255, 60, 0.5)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(14px, -22px, 0) scale(1.12)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(191, 255, 60, 0.45)' },
          '70%, 100%': { boxShadow: '0 0 0 16px rgba(191, 255, 60, 0)' },
        },
        'blur-in': {
          from: { opacity: '0', filter: 'blur(12px)', transform: 'translateY(18px)' },
          to: { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.7) translateY(10px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.2s ease-out infinite',
        'blur-in': 'blur-in 0.9s cubic-bezier(0.21, 0.47, 0.32, 0.98) both',
        'pop-in': 'pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};
