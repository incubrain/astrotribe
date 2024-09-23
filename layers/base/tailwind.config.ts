import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import type { Config } from 'tailwindcss'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default <Partial<Config>>{
  darkMode: 'selector',
  safelist: [
    '-inset-[10%]',
    '-inset-[30%]',
    {
      pattern:
        /(bg|border|text|from|to)-(primary|amber|blue|red|green|purple)-(100|400|500|700|800|900)/,
      variants: ['hover'],
    },
    {
      pattern: /backdrop-blur-(sm|md|lg|xl)/,
    },
  ],
  theme: {
    fontSize: {
      xs: '0.625rem',
      sm: '0.85rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '4.052rem',
    },
    extend: {
      screens: {
        '2xl': '1536px',
      },
      gridTemplateColumns: {
        nav: 'minmax(240px, 1fr) minmax(420px, 2fr) minmax(300px,1fr)',
      },
      animation: {
        'spin-slow': 'spin 300s linear infinite',
        glitter: 'glitter 8s ease-in 0s infinite',
        'swipe-in': 'loadin 250ms ease-in-out 0s forwards',
        'swipe-down': 'scaleY 350ms ease-in-out 0s forwards',
        'pop-in': 'pop-in 250ms ease-in-out 0s forwards',
      },
      keyframes: {
        glitter: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '25%': {
            transform: 'scale(1.6)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '75%': {
            transform: 'scale(1.6)',
            opacity: '1',
          },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        loadin: {
          '0%': {
            transform: 'scaleX(0)',
          },
          '100%': {
            transform: 'scaleX(1)',
          },
        },
        scaleY: {
          '0%': {
            transform: 'scaleY(0)',
          },
          '100%': {
            transform: 'scaleY(1)',
          },
        },
        'pop-in': {
          '0%': {
            transform: 'scale(0.9)',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  content: [
    // '../../packages/*/components/**/*.{vue,js,ts}',
    // '../../packages/*/layouts/**/*.vue',
    // '../../packages/*/pages/**/*.vue',
    // '../../packages/*/plugins/**/*.{js,ts}',
    resolve(currentDir, './theme/**/*.{js,vue,ts}'),
    resolve(currentDir, './components/**/*.{js,vue,ts}'),
    resolve(currentDir, './pages/**/*.{js,vue,ts}'),
    resolve(currentDir, './assets/**/*.{js,vue,ts}'),
    resolve(currentDir, './layouts/**/*.{js,vue,ts}'),
  ],
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-primeui')],
}
