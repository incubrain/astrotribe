import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  alias: {
    '@ib/client': resolve(currentDir, '../../libs/client/src'),
    '@ib/server': resolve(currentDir, '../../libs/server/src'),
  },

  vite: {
    root: currentDir,
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        '@ib/client': resolve(currentDir, '../../libs/client/src/index.ts'),
        '@ib/server': resolve(currentDir, '../../libs/server/src/index.ts'),
      },
    },
  },

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
    cookieName: 'sb',
  },

  runtimeConfig: {
    public: {},
    supabaseServiceKey: '',
  },
})
