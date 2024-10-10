import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const currentDir = dirname(fileURLToPath(import.meta.url))

console.log('Node Env:', process.env.NODE_ENV)

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
})
