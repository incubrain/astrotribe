import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'
import baseConfig from '../../shared/tailwind.config.base'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default {
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        space: ['Orbitron', 'sans-serif'],
        typed: ['Railway', 'sans-serif'],
      },
      fontDisplay: 'swap',
      fontSize: {
        '6xl': '4rem', // 64px
        '7xl': '5rem', // 80px
        '8xl': '6rem', // 96px
      },
    },
  },
  content: [
    resolve(currentDir, './components/**/*.{vue,ts}'),
    resolve(currentDir, './layouts/**/*.{vue,ts}'),
    resolve(currentDir, './pages/**/*.{vue,ts}'),
    resolve(currentDir, './composables/**/*.{vue,ts}'),
    '../../theme/**/*.{js,css}',
  ],
} satisfies Config
