// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { fileURLToPath } from 'url'

export default defineNuxtConfig({
    app: {
        layoutTransition: { name: 'layout', mode: 'out-in' },
        head: {
            // link: [
            //   { rel: 'stylesheet', href: '' }
            // ],
            script: [
                // Insert your Google Tag Manager Script here
                // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
            ],
        },
    },
    css: ['/assets/main.css', 'vuetify/lib/styles/main.css'],
    generate: {
        // dir: 'output',
        subFolders: true,
    },
    imports: {
        dirs: ['stores'],
    },
    // routeRules: {
    //     '/auth/**': { swr: 1200 },
    // },
    formkit: {
        configFile: './formkit.config.ts',
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@formkit/nuxt',
        '@nuxt/content',
        '@nuxtjs/partytown',
        '@nuxtjs/color-mode',
        'nuxt-icon',
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore', 'acceptHMRUpdate'],
            },
        ],
    ],
    partytown: {
        // For google analytics
        forward: ['dataLayer.push'],
    },
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
        typeCheck: true,
    },
    log: {
        level: 'debug',
        //  possible values are debug, info, warn, error, and fatal.
        format: 'common',
        // possible values are tiny, short, common, combined, and json
        destination: '/server/log/nuxt.log',
    },
    nitro: {
        preset: 'render-com',
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
    build: {
        transpile: ['vuetify'],
    },
    // alias: {
    //     '@data': "/assets/data",
    // },
    ssr: false,
    content: {
        // Nuxt content options
        highlight: {
            // Theme used in all color schemes.
            theme: {
                // Default theme (same as single string)
                default: 'github-dark',
                // Theme used if `html.dark`
                dark: 'github-light',
                // Theme used if `html.sepia`
                sepia: 'monokai',
            },
        },
    },
})
