// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  // unlighthouse: {
  //   scanner: {
  //     // simulate a desktop device
  //     device: 'desktop'
  //   }
  // },
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
      link: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }]
      // script: [
      // Insert your Google Tag Manager Script here
      // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
      //   ]
    }
  },
  css: ['/assets/css/tailwind.css', 'lightgallery/css/lightgallery-bundle.css'],
  imports: {
    dirs: ['stores', 'themes']
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
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate']
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
  runtimeConfig: {
    // Keys within public, will be also exposed to the client-side
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY
    },
    // The private keys which are only available within server-side
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY
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
  // For @nuxt/image-edge
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
  // alias: {
  //     '@data': "/assets/data",
  // },
  ssr: true
})
