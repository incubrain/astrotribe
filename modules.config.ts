import type { ModuleOptions, NuxtConfig } from '@nuxt/schema'

export const MODULES: NuxtConfig['modules'] = [
  // '@nuxtjs/partytown',
  '@nuxt/devtools',
  '@vueuse/nuxt',
  '@nuxt/image',
  '@pinia/nuxt',
  '@nuxtjs/seo',
  '@nuxt/content',
  'nuxt-primevue',
  '@nuxtjs/tailwindcss',
  '@nuxtjs/color-mode',
  '@nuxthq/studio',
  '@nuxtjs/supabase',
  'nuxt-icon',
  'nuxt-security'
]

const PINIA_OPTIONS: NuxtConfig['pinia'] = {
  autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs']
}

// !infra:med:hard:12 - look into and configure nuxt security module
// https://nuxt-security.vercel.app/documentation/getting-started/configuration
const SECURITY_OPTIONS: NuxtConfig['security'] = {
  headers: {
    contentSecurityPolicy: {
      'img-src': [
        "'self'",
        'data:',
        'http://localhost:54321',
        'http://localhost:3000',
        'https://www.nasa.gov',
        'https://science.nasa.gov',
        'https://www.youtube.com',
        'https://s.ytimg.com',
        'https://pbs.twimg.com',
        'https://media.licdn.com'
      ],
      'script-src': [
        "'self'",
        "'nonce-{{nonce}}'",
        "'unsafe-inline'",
        'http://localhost:3000',
        'https://www.youtube.com',
        'https://s.ytimg.com'
      ]
    },
    xFrameOptions: 'DENY', // Prevents clickjacking
    crossOriginResourcePolicy: 'cross-origin', // Ensures resources are allowed
    crossOriginOpenerPolicy: 'same-origin',
    // needed for devtools
    crossOriginEmbedderPolicy:
      process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp'
  },
  requestSizeLimiter: {
    maxUploadFileRequestInBytes: 2000000, // 2 MB
    throwError: true,
    maxRequestSizeInBytes: 2000000 // 2 MB
  },
  xssValidator: false,
  corsHandler: false,
  allowedMethodsRestricter: false,
  hidePoweredBy: false,
  basicAuth: false,
  csrf: false,
  nonce: true,
  removeLoggers: false,
  ssg: false,
  sri: false
}

const SEO_OPTIONS: NuxtConfig['seo'] = {
  redirectToCanonicalSiteUrl: true
}

const OG_IMAGE_OPTIONS: NuxtConfig['ogImage'] = {
  componentOptions: {
    global: true
  }
}

const CONTENT_OPTIONS: NuxtConfig['content'] = {
  highlight: {
    theme: {
      // !todo: light theme not working ??
      default: 'github-light',
      light: 'github-light',
      dark: 'github-dark'
    }
  }
}

const PRIMEVUE_OPTIONS: NuxtConfig['primevue'] = {
  components: {
    prefix: 'Prime',
    include: '*',
    exclude: ['Editor', 'Chart']
  },
  directives: {
    include: '*',
    exclude: []
  },
  composables: {
    include: '*',
    exclude: []
  },
  options: {
    ripple: true
  },
  cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
}

const IMAGE_OPTIONS: NuxtConfig['image'] = {
  format: ['webp', 'jpg']
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
}

const COLOR_MODE_OPTIONS: NuxtConfig['colorMode'] = {
  classSuffix: ''
}

const SUPABASE_OPTIONS: NuxtConfig['supabase'] = {
  redirectOptions: {
    login: '/auth/login',
    callback: '/auth/confirm',
    include: ['/astrotribe/**'],
    exclude: [],
    cookieRedirect: true
  },
  clientOptions: {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  },
  cookieName: 'sb'
}

export const MODULE_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {
  pinia: PINIA_OPTIONS,
  security: SECURITY_OPTIONS,
  primevue: PRIMEVUE_OPTIONS,
  seo: SEO_OPTIONS,
  ogImage: OG_IMAGE_OPTIONS,
  content: CONTENT_OPTIONS,
  image: IMAGE_OPTIONS,
  colorMode: COLOR_MODE_OPTIONS,
  supabase: SUPABASE_OPTIONS
}

export const DEV_MODULE_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {}
