import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { Config } from 'tailwindcss'
import baseConfig from '../../shared/tailwind.config.base'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default {
  presets: [baseConfig],
  content: [
    resolve(currentDir, 'pages/**/*.{js,vue,ts}'),
    resolve(currentDir, 'layouts/**/*.{js,vue,ts}'),
    resolve(currentDir, 'composables/**/*.{js,vue,ts}'),
    resolve(currentDir, 'components/**/*.{js,vue,ts}'),
    '../../theme/**/*.{js,css,ts}',
  ],
  exclude: ['server/**/*'],
} satisfies Config
