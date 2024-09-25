import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],
  devServer: {
    host: 'localhost',
    port: 3009,
  },

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
  ],

  // vite: {
  //   plugins: [nxViteTsPaths()],
  // },

  imports: {
    autoImport: true,
  },

  routeRules: {
    '/': { redirect: '/register' },
  },
});
