// config/plugins.js

module.exports = ({ env }) => ({
  upload: {
    config: {
      customProvider: require.resolve('../src/providers/supabase/index.ts'),
      provider: 'supabase',
      providerOptions: {
        endpoint: env('SUPABASE_STORAGE_URL'),
        accessKeyId: env('SUPABASE_ACCESS_KEY'),
        secretAccessKey: env('SUPABASE_SECRET_KEY'),
        bucket: env('SUPABASE_BUCKET'),
        region: 'ap-south-1',
      },
    },
  },
})
