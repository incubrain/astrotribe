import type { ModuleOptions, NuxtConfig } from '@nuxt/schema'

export const MODULES: NuxtConfig['modules'] = [
  // '@nuxtjs/partytown',
  '@nuxt/devtools',
  '@nuxt/ui',
  '@vueuse/nuxt',
  '@nuxt/image',
  '@pinia/nuxt',
  '@nuxtjs/seo',
  '@nuxt/content',
  'nuxt-primevue',
  '@nuxthq/studio'
]

const PINIA_OPTIONS: NuxtConfig['pinia'] = {
  autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs']
}

const ROBOTS_OPTIONS: NuxtConfig['robots'] = {
  configPath: '~/robots.config.ts'
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

const PRIMEVUE_OPTIONS: NuxtConfig["primevue"] = {
  components: {
    include: "*",
    exclude: [],
    prefix: "Prime",
  },
  directives: {
    include: "*",
    exclude: [],
  },
  composables: {
    include: "*",
    exclude: [],
  },
  options: {
    ripple: true,
  },
  importPT: { as: "Tailwind", from: "primevue/passthrough/tailwind" },
  cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
};

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

const UI_OPTIONS: NuxtConfig['ui'] = {
  icons: ['mdi', 'heroicons', 'material-symbols']
}

export const MODULE_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {
  pinia: PINIA_OPTIONS,
  primevue: PRIMEVUE_OPTIONS,
  robots: ROBOTS_OPTIONS,
  seo: SEO_OPTIONS,
  ogImage: OG_IMAGE_OPTIONS,
  content: CONTENT_OPTIONS,
  image: IMAGE_OPTIONS,
  colorMode: COLOR_MODE_OPTIONS,
  ui: UI_OPTIONS
}

export const MODULE_DEV_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {}
