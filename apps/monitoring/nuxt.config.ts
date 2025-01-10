import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import { sharedRuntimeConfig } from '../../shared/runtime.config'
import { devPortMap } from '../../shared/paths.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: ['../../layers/base', '../../layers/supabase'],
  modules: ['@primevue/nuxt-module'],

  imports: {
    autoImport: true,
  },

  runtimeConfig: {
    ...sharedRuntimeConfig.runtimeConfig.private,
    public: {
      serviceName: 'auth',
      ...sharedRuntimeConfig.runtimeConfig.public,
    },
  },
  srcDir: '.',
  workspaceDir: '../../',

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  devServer: {
    // Check if we're running in a multi-app dev environment
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? new URL(devPortMap.monitoring).port : '3000',
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

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },
})
