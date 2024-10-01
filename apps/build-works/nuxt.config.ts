import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  alias: {
    '@ib/utils': resolve(currentDir, '../../libs/utilities/src'),
  },

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
  ],

  css: [resolve(currentDir, './assets/css/tailwind.css')],

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: `${currentDir}/assets/css/tailwind.css`,
    exposeConfig: true,
    injectPosition: 0,
    viewer: true,
  },

  vite: {
    root: currentDir,
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        '@ib/utils': resolve(currentDir, '../../libs/utilities/src/index.ts'),
      },
    },
  },

  primevue: {
    importPT: { from: resolve(currentDir, '../../theme/index.js') },
    autoImport: true,
    components: {
      prefix: 'Prime',
      include: '*',
      exclude: ['Editor'],
    },

    composables: {
      include: '*',
    },

    options: {
      ripple: true,
      unstyled: true,
      theme: {
        options: {
          cssLayer: {
            name: 'primeui',
            order: 'tailwind-base, primeui, tailwind-utilities',
          },
        },
      },
    },
  },

  imports: {
    autoImport: true,
  },
})
