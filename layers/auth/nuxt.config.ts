import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const currentDir = dirname(fileURLToPath(import.meta.url))

console.log('Node Env:', process.env.NODE_ENV)

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  modules: ['@nuxtjs/supabase'],

  supabase: {
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
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
    cookieName: 'sb',
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
    supabaseServiceKey: '',
  },
})
