// config/plugins.js

module.exports = ({ env }) => {
  console.log('Loading production plugin config...')
  console.log('SUPABASE_PROJECT_URL:', process.env.SUPABASE_PROJECT_URL)

  return {
    upload: {
      config: {
        provider: 'strapi-provider-upload-supabase',
        providerOptions: {
          endpoint: process.env.SUPABASE_PROJECT_URL || '',
          accessKeyId: process.env.SUPABASE_ACCESS_KEY || '',
          secretAccessKey: process.env.SUPABASE_SECRET_KEY || '',
          bucket: process.env.SUPABASE_BUCKET || '',
          region: process.env.SUPABASE_REGION || 'ap-south-1',
        },
      },
    },
  }
}
