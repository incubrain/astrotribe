import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'
import baseConfig from '../../tailwind.config.base'

const currentDir = dirname(fileURLToPath(import.meta.url))

const config: Partial<Config> = {
  presets: [baseConfig],
  theme: {
    extend: {
      // Add app-specific extensions here
    },
  },
  content: [resolve(currentDir, '**/*.{js,vue,ts}')],
}

export default config
