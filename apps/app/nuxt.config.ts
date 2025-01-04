import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import sharedConfig from '../../shared-runtime.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  debug: true,
  sourcemap: true,
  workspaceDir: '../../',
  srcDir: '.',
  extends: [
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/advert',
    '../../layers/referral',
  ],

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },

  // build: {
  //   transpile: ['@formbricks/js'],
  // },

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
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: false,
    workbox: {
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

  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },

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
        appMiddleware: ['feature-limit'],
      },
      '/api/folders/**': {
        appMiddleware: ['feature-limit'],
      },
      '/api/feeds/**': {
        appMiddleware: ['feature-limit'],
      },
    },
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },

  runtimeConfig: {
    ...sharedConfig.runtimeConfig.private,
    serviceName: '@astronera/app',
    public: {
      ...sharedConfig.runtimeConfig.public,
      serviceName: '@astronera/app',
    },
  },
})
