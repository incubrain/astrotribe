import { defineEventHandler, getRequestHeader, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  const allowedDomains = ['astronera.org', 'up.railway.app', 'rlwy.net', 'localhost']

  const origin = getRequestHeader(event, 'origin') || ''

  const isAllowedOrigin = allowedDomains.some(
    (domain) =>
      origin.startsWith('http://localhost:') || // Allow any localhost port
      origin.endsWith(`.${domain}`) || // Allow all subdomains
      origin === `https://${domain}`, // Allow apex domain
  )

  if (isAllowedOrigin || process.env.NODE_ENV !== 'production') {
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
