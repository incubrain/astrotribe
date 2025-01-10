import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import { sharedRuntimeConfig } from '../../shared/runtime.config'
import { devPortMap } from '../../shared/paths.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: [
    '../../layers/logging',
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

  ssr: false,

  runtimeConfig: {
    ...sharedRuntimeConfig.runtimeConfig.private,
    serviceName: 'admin',
    public: {
      ...sharedRuntimeConfig.runtimeConfig.public,
      serviceName: 'admin',
    },
  },
  srcDir: '.',
  workspaceDir: '../../',

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.admin : 3000,
  },

  compatibilityDate: '2025-01-10',

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

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },
})
