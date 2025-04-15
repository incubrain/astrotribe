import { defineNuxtConfig } from 'nuxt/config'

console.log('Node Env:', process.env.NODE_ENV)

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  $meta: {
    name: 'supabase',
  },

  srcDir: '.',
  workspaceDir: '../../',

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    cookieOptions: {
      domain:
        process.env.NODE_ENV === 'production'
          ? 'astronera.org' // This will work for all subdomains
          : 'localhost',
      maxAge: 60 * 60 * 8,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
    cookiePrefix: 'sb', // Updated from cookieName which is deprecated
  },
})
