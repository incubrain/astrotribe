import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'
import baseConfig from '../../shared/tailwind.config.base'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default {
  presets: [baseConfig],
  theme: {
    extend: {
      // Add app-specific extensions here
    },
  },
  content: [
    resolve(currentDir, './components/**/*.{vue,ts}'),
    resolve(currentDir, './layouts/**/*.{vue,ts}'),
    resolve(currentDir, './pages/**/*.{vue,ts}'),
    resolve(currentDir, './composables/**/*.{vue,ts}'),
    '../../theme/**/*.{js,css,ts}',
  ],
} satisfies Config
