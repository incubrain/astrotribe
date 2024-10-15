import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'
import baseConfig from '../../tailwind.config.base'

const currentDir = dirname(fileURLToPath(import.meta.url))

const config: Partial<Config> = {
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        space: ['Orbitron', 'sans-serif'],
        typed: ['Source Code Pro', 'monospace'],
      },
      fontSize: {
        '6xl': '4rem', // 64px
        '7xl': '5rem', // 80px
        '8xl': '6rem', // 96px
      },
    },
  },
  content: [resolve(currentDir, '**/*.{js,vue,ts}'), '../../theme/**/*.{js,css}'],
}

export default config
