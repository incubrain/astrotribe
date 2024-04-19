import type { Config } from 'tailwindcss'
import c from 'tailwindcss/colors'

export default <Partial<Config>>{
  darkMode: 'selector',
  theme: {
    fontSize: {
      xs: '0.625rem',
      sm: '0.85rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '4.052rem'
    },
    extend: {
      screens: {
        '2xl': '1536px'
      },
      gridTemplateColumns: {
        nav: 'minmax(240px, 1fr) minmax(420px, 2fr) minmax(300px,1fr)'
      },
      colors: {
        primary: c.cyan,
        secondary: c.indigo,
        error: c.red,
        success: c.green,
        warning: c.yellow,
        info: c.cyan
      },
      animation: {
        'spin-slow': 'spin 300s linear infinite',
        glitter: 'glitter 8s ease-in 0s infinite',
        'swipe-in': 'loadin 250ms ease-in-out 0s forwards',
        'swipe-down': 'scaleY 350ms ease-in-out 0s forwards',
        'pop-in': 'pop-in 250ms ease-in-out 0s forwards'
      },
      keyframes: {
        glitter: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0'
          },
          '25%': {
            transform: 'scale(1.6)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(0.8)',
            opacity: '0'
          },
          '75%': {
            transform: 'scale(1.6)',
            opacity: '1'
          },
          '100%': { transform: 'scale(0.8)', opacity: '0' }
        },
        loadin: {
          '0%': {
            transform: 'scaleX(0)'
          },
          '100%': {
            transform: 'scaleX(1)'
          }
        },
        scaleY: {
          '0%': {
            transform: 'scaleY(0)'
          },
          '100%': {
            transform: 'scaleY(1)'
          }
        },
        'pop-in': {
          '0%': {
            transform: 'scale(0.9)'
          },
          '50%': {
            transform: 'scale(1.1)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
