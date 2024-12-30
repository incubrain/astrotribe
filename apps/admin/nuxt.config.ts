import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import sharedConfig from '../../shared-runtime.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: [
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/advert',
    '../../layers/referral',
  ],
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

  vite: {
    optimizeDeps: {
      exclude: ['@ib/logger'],
    },
    resolve: {
      alias: {
        '@ib/logger': fileURLToPath(
          new URL('../../libs/logger/dist/esm/src/index.js', import.meta.url),
        ),
      },
    },
  },

  build: {
    transpile: ['@ib/logger'],
  },

  ssr: false,

  nitro: {
    experimental: {
      websocket: true,
      asyncContext: true,
    },
    rollupConfig: {
      external: [
        'winston',
        'winston-transport',
        'util',
        'os',
        'fs',
        'path',
        'zlib',
        'http',
        'https',
      ],
    },
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
      // exclude: ['Editor'],
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
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
  },

  runtimeConfig: {
    ...sharedConfig.runtimeConfig.private,
    serviceName: '@astronera/admin',
    public: {
      ...sharedConfig.runtimeConfig.public,
      serviceName: '@astronera/admin',
    },
  },
})
