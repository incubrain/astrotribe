export default defineNuxtConfig({
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
    cookieName: 'sb',
  },

  runtimeConfig: {
    public: {},
  },
})
