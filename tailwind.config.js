/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          base: '#080B0F',
          elevated: '#0D1117',
          deep: '#05070A',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.055)',
          strong: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.10)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
        },
        text: {
          primary: '#F4F7F8',
          secondary: '#9BA7AE',
          muted: '#65717A',
        },
        mint: {
          DEFAULT: '#7CF5C8',
          dark: '#07100D',
          glow: 'rgba(124, 245, 200, 0.15)',
          dim: 'rgba(124, 245, 200, 0.08)',
        },
        cyan: {
          accent: '#7DDDF5',
          glow: 'rgba(125, 221, 245, 0.12)',
        },
        warm: {
          accent: '#FFB86B',
          dim: 'rgba(255, 184, 107, 0.1)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        glass: '20px',
        'glass-sm': '14px',
      },
      backdropBlur: {
        glass: '18px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
