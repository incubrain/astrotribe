import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'

const currentDir = dirname(fileURLToPath(import.meta.url))

const config: Partial<Config> = {
  presets: [require('../../tailwind.config.base')],
  theme: {
    extend: {
      // Add app-specific extensions here
    },
  },
  content: [resolve(currentDir, '**/*.{js,vue,ts}'), '../../theme/**/*.{js,css,ts}'],
}

export default config
