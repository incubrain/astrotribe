import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import runtimeConfig from '../../shared-runtime.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base', '../../layers/auth', '../../layers/crud', '../../layers/advert'],

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },

  build: {
    transpile: ['@formbricks/js'],
  },

  plugins: [{ src: '~/plugins/formbricks.client.ts' }],

  debug: true,

  modules: [
    'nuxt-tiptap-editor',
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/mdc',
    '@primevue/nuxt-module',
  ],

  experimental: {
    asyncContext: true,
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
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
          cssLayer: true,
        },
      },
    },
  },

  image: {
    format: ['webp', 'jpg'],
  },

  tiptap: {
    prefix: 'Tiptap',
  },

  ...runtimeConfig,
})
