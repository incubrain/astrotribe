// Helper function to safely get domain from URL
const getSupabaseDomain = () => {
  const url = process.env.SUPABASE_STORAGE_URL
  if (!url) return ''
  try {
    return url.replace(/^https?:\/\//, '')
  } catch {
    return ''
  }
}

export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frameAncestors': ['http://localhost:*', 'self'],
          'connect-src': ["'self'", 'http:', 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'http:',
            'https:',
            'cms.astronera.org',
            '*.astronera.org',
            getSupabaseDomain(),
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'http:',
            'https:',
            'cms.astronera.org',
            '*.astronera.org',
            getSupabaseDomain(),
          ],
          'upgradeInsecureRequests': null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://staging.website.astronera.org',
        'https://astronera.org',
        'https://staging.cms.astronera.org',
        'https://cms.astronera.org',
        'https://*.astronera.org',
        'https://*.up.railway.app',
        `https://${getSupabaseDomain()}`,
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'sentry-trace', 'baggage'],
      expose: ['WWW-Authenticate', 'Server-Authorization'],
      credentials: false,
      maxAge: 31536000,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]
