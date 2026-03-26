import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'base-blue-dark': 'var(--base-blue-dark)',
        'base-blue': 'var(--base-blue)',
        'base-grey-dark': 'var(--base-grey-dark)',
        'base-grey': 'var(--base-grey)',
        'accent': 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Work Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
        headline: ['var(--font-headline)', 'Space Grotesk', 'TT Firs', 'Segoe UI', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Work Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px var(--accent-glow)',
        'glow-sm': '0 0 20px var(--accent-glow)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
