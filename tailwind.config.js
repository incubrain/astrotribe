/** @type {import('tailwindcss').Config} */

import cssVariables from './assets/variables.css'

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  mode: 'jit',
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1224px',
      // => @media (min-width: 1024px) { ... }

      xl: '1680px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '2000px'
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      gradientColorStops: {
        hue: withOpacity('--color-fill')
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
            opacity: 0
          },
          '25%': {
            transform: 'scale(1.6)',
            opacity: 1
          },
          '50%': {
            tranwidsform: 'scale(0.8)',
            opacity: 0
          },
          '75%': {
            transform: 'scale(1.6)',
            opacity: 1
          },
          '100%': { transform: 'scale(0.8)', opacity: 0 }
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
      },
      fontFamily: {
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    // https://tailwindcss.com/docs/typography-plugin
    require('@tailwindcss/forms')
    // https://github.com/tailwindlabs/tailwindcss-forms
  ]
}
