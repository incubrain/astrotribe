// config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-supabase',
      providerOptions: {
        endpoint: env('SUPABASE_STORAGE_URL'),
        accessKeyId: env('SUPABASE_API_KEY'),
        secretAccessKey: env('SUPABASE_SECRET'),
        bucket: env('SUPABASE_BUCKET'),
        region: 'ap-south-1',
      },
    },
  },
})
