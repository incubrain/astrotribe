// src/middleware/cors.ts

export default defineEventHandler((event) => {
  const allowedOrigins = [
    'https://auth-production-afcc.up.railway.app',
    'https://website-production-5ad5.up.railway.app',
    'https://app-production-f479.up.railway.app',
    'https://admin-production-cf89.up.railway.app',
    'https://monorail.proxy.rlwy.net:51428:8080',
    'https://auth.astronera.org',
    'https://admin.astronera.org',
    'https://app.astronera.org',
    'https://monitoring.astronera.org',
    'https://astronera.org',
    'http://localhost:3000',
  ]
  const origin = getRequestHeader(event, 'origin') || ''

  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
    })
  }

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content.'
    return 'OK'
  }
})
