import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import sharedConfig from '../../shared-runtime.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base', '../../layers/supabase'],
  modules: ['@primevue/nuxt-module'],

  routeRules: {
    '/**': { appMiddleware: 'auth' },
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
    ...sharedConfig.runtimeConfig.private,
    public: {
      serviceName: '@astronera/auth',
      ...sharedConfig.runtimeConfig.public,
    },
  },
})
