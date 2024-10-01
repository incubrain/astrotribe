import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base', '../../layers/auth'],
  modules: ['@primevue/nuxt-module'],

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: `${currentDir}/assets/css/tailwind.css`,
    exposeConfig: true,
    injectPosition: 0,
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
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
  },

  imports: {
    autoImport: true,
  },

  runtimeConfig: {
    influxUrl: '',
    influxToken: '',
    influxOrg: '',
    influxBucket: '',
  },
})
