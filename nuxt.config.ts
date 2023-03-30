// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    // head: {
    //     link: [
    //       { rel: 'stylesheet', href: '' }
    //     ],
    //     script: [
    //         // Insert your Google Tag Manager Script here
    //         { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
    //     ],
    // },
  },
  css: ['/assets/main.css'],
  imports: {
    dirs: ['stores'],
  },
  // formkit: {
  //     configFile: './formkit.config.ts',
  // },
  modules: [
    '@nuxtjs/tailwindcss',
    '@formkit/nuxt',
    '@nuxtjs/partytown',
    '@nuxt/devtools',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],
  // partytown: {
  //     // For google analytics
  //     forward: ['dataLayer.push'],
  // },
  runtimeConfig: {
    // Keys within public, will be also exposed to the client-side
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
    // The private keys which are only available within server-side
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  },
  typescript: {
    shim: false,
    tsConfig: {
      exclude: ['node_modules', 'dist'],
      compilerOptions: {
        // types: ['@nuxt/types', 'vite/client', './types/types.d.ts'],
        strict: true,
      },
    },
  },
  // nitro: {
  //     preset: 'render-com',
  // },
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
  ssr: false,
})
