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
    '@vite-pwa/nuxt',
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
    registerType: 'autoUpdate', // Automatically update the service worker
    manifest: {
      screenshots: [
        {
          src: '/screenshots/screenshot1.png',
          sizes: '640x480',
          type: 'image/png',
        },
        // Add more screenshots
      ],
      lang: 'en',
      dir: 'ltr',
      name: 'AstronEra',
      short_name: 'Astron',
      description: 'Your Daily Astronomical Dose',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/favicons/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/favicons/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/offline',
      runtimeCaching: [
        {
          urlPattern: new RegExp(`^${process.env.SUPABASE_URL}/.*$`),
          handler: 'NetworkFirst',
          method: 'GET',

          options: {
            cacheName: 'supabase-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true, // Enable PWA in development mode
    },
  },

  ...runtimeConfig,
})
