// https://v3.nuxtjs.org/api/configuration/nuxt.config

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description: 'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url: 'https://astronera.com'
}

export default defineNuxtConfig({
  // unlighthouse: {
  //   scanner: {
  //     // simulate a desktop device
  //     device: 'desktop'
  //   }
  // },
  // routeRules: {
  //   '/auth/**': {
  //     swr: 60 * 60
  //   }
  // },
  nitro: {
    // Production
    storage: {
      data: {
        driver: 'vercelKV',
        base: 'astrotribe:'
      }
    },
    // Development
    devStorage: {
      data: {
        driver: 'fs',
        base: './data/kv'
      }
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('swiper-')
    }
  },
  ui: {
    icons: ['mdi', 'heroicons', 'material-symbols']
  },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { property: 'title', content: og.description },
        { property: 'description', content: og.description },
        { property: 'og:title', content: og.title },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: og.image },
        { property: 'og:description', content: og.description },
        { property: 'og:url', content: og.url },
        { name: 'twitter:card', content: 'Twitter Card' },
        { name: 'twitter:title', content: og.title },
        { name: 'twitter:description', content: og.description },
        { name: 'twitter:image', content: og.image }
      ]
      // script: [
      // Insert your Google Tag Manager Script here
      // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
      //   ]
    }
  },
  css: ['lightgallery/css/lightgallery-bundle.css'],
  imports: {
    dirs: ['stores', 'data']
  },
  colorMode: {
    classSuffix: ''
  },
  modules: [
    '@nuxtjs/partytown',
    '@nuxt/devtools',
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@nuxt/image',
    // '@unlighthouse/nuxt',
    '@nuxtjs/robots',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs']
      }
    ]
  ],
  build: {
    transpile: ['swiper', 'lightgallery']
  },
  // partytown: {
  //     // For google analytics
  //     forward: ['dataLayer.push'],
  // },
  robots: {
    configPath: '~/robots.config.ts'
  },
  runtimeConfig: {
    // Keys within public, will be also exposed to the client-side
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY
    },
    // The private keys which are only available within server-side
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    NASA_API_KEY: process.env.NASA_API_KEY
  },
  typescript: {
    shim: false,
    tsConfig: {
      exclude: ['node_modules', 'dist'],
      compilerOptions: {
        // types: ['@nuxt/types', 'vite/client', './types/types.d.ts'],
        strict: true
      }
    }
  },
  image: {
    format: ['webp', 'jpg']
  },
  // image: {
  //   domains: ["dohemiycqebeipbvsvnr.supabase.co"],
  //   presets: {
  //     cover: {
  //       modifiers: {
  //         format: "jpg",
  //         quality: 80,
  //         sizes: "sm:100vw md:50vw lg:800px",
  //       },
  //     },
  //     card: {
  //       modifiers: {
  //         format: "jpg",
  //         quality: 70,
  //         sizes: "sm:100vw md:40vw lg:300px",
  //       },
  //     },
  //   },
  // },
  ssr: true
})
