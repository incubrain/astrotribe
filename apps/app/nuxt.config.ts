import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import { config } from 'dotenv'
import { devPortMap } from '../../shared/paths.config'
import { sharedRuntimeConfig } from '../../shared/runtime.config'

// Load environment variables from the root .env file
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

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
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/mdc',
    '@primevue/nuxt-module',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
  ],

  runtimeConfig: {
    ...sharedRuntimeConfig.runtimeConfig.private,
    serviceName: 'app',
    public: {
      ...sharedRuntimeConfig.runtimeConfig.public,
      serviceName: 'app',
    },
  },
  srcDir: '.',
  workspaceDir: '../../',

  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.app : 3000,
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2025-01-09',

  // Add proper MIME type handling
  nitro: {
    experimental: {
      asyncContext: true,
    },
    routeRules: {
      '/manifest.webmanifest': {
        headers: {
          'Content-Type': 'application/manifest+json',
          'Cache-Control': 'public, max-age=0',
        },
      },
      '/api/bookmarks/**': {
        appMiddleware: ['3-reset-password'],
      },
      '/api/folders/**': {
        appMiddleware: ['3-reset-password'],
      },
      '/api/feeds/**': {
        appMiddleware: ['3-reset-password'],
      },
    },
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },
  debug: {
    // Enable specific debugging features
    templates: true,
    modules: true,
    watchers: true,
    hooks: {
      client: true,
      server: true,
    },
    nitro: true,
    router: true,
    hydration: true,
  },

  image: {
    format: ['webp', 'jpg'],
    provider: 'ipx',
    ipx: {
      // Set a valid base URL to avoid initialization issues
      baseURL: '/images',
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
          cssLayer: true,
        },
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: false,
    workbox: {
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^\/api\//,
          handler: 'NetworkFirst',
        },
      ],
    },
    client: {
      installPrompt: true,
    },
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },

})
