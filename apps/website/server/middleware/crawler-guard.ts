import dns from 'dns/promises'
import { defineEventHandler, getHeaders, setResponseStatus, send } from 'h3'

const ALLOWED_CRAWLER_PATTERNS: RegExp[] = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /meta-externalagent/i,
  /twitterbot/i,
  /rogerbot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest/i,
  /slackbot/i,
  /vkShare/i,
  /applebot/i,
  /Exabot/i,
  /Sogou Spider/i,
  /SemrushBot/i,
  /AhrefsBot/i,
  /MJ12bot/i,
  /DotBot/i,
  /redditbot/i,
  /Discordbot/i,
  /BLEXBot/i,
]

const HOSTNAME_PATTERNS: { [key: string]: RegExp[] } = {
  googlebot: [/\.googlebot\.com$/i, /\.google\.com$/i],
  bingbot: [/\.search\.msn\.com$/i],
  yandexbot: [/\.yandex\.ru$/i],
  duckduckbot: [/\.duckduckgo\.com$/i],
  baiduspider: [/\.baidu\.com$/i],
  facebookexternalhit: [/\.facebook\.com$/i],
  ['meta-externalagent']: [
    /\.facebook\.com$/i,
    /meta-externalagent/i,
    // Add Meta's known IP ranges
    /^57\.141\./i,
    /^157\.(240|241|242|243)\./i,
    /^69\.(63|171)\./i,
    /^66\.220\./i,
    /^31\.13\./i,
    /^173\.252\./i,
  ],
  twitterbot: [/\.twitter\.com$/i],
  linkedinbot: [/\.linkedin\.com$/i],
  pinterest: [/\.pinterest\.com$/i],
  redditbot: [/\.reddit\.com$/i],
  // Add patterns for other crawlers as needed
}

const MAX_PATH_DEPTH = 6

// Simple in-memory cache for reverse DNS results
const rdnsCache = new Map<string, { hostnames: string[]; expiresAt: number }>()
const RDNS_CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

export default defineEventHandler(async (event) => {
  if (import.meta.prerender) {
    return
  }

  const url = new URL(event.node.req.url || '/', `http://${event.node.req.headers.host}`)

  const internalPaths = [
    '/_ipx/',
    '/api/',
    '/_nuxt/',
    '/favicon.ico',
    '__nuxt_error',
    '/robots.txt',
    '/sitemap.xml',
  ]

  if (internalPaths.some((prefix) => url.pathname.startsWith(prefix))) {
    // Skip middleware processing for internal routes
    return
  }

  const headers = getHeaders(event)
  const userAgent = headers['user-agent'] || ''
  const clientIP =
    event.node.req.socket.remoteAddress || headers['x-forwarded-for'] || headers['x-real-ip'] || ''

  // Detect if the request is from a crawler
  const isCrawler = /bot|crawler|spider|crawling/i.test(userAgent)
  const matchedPattern = ALLOWED_CRAWLER_PATTERNS.find((pattern) => pattern.test(userAgent))
  const isAllowedCrawler = !!matchedPattern

  // Calculate path depth
  const path = url.pathname
  const pathDepth = path.split('/').filter(Boolean).length

  if (isCrawler) {
    const cacheEntry = rdnsCache.get(clientIP)
    let hostnames: string[] = []

    const currentTime = Date.now()
    if (cacheEntry && cacheEntry.expiresAt > currentTime) {
      hostnames = cacheEntry.hostnames
    } else {
      try {
        hostnames = await dns.reverse(clientIP)
        rdnsCache.set(clientIP, { hostnames, expiresAt: currentTime + RDNS_CACHE_TTL })
      } catch (err: any) {
        console.warn(`Reverse DNS Lookup Failed for IP: ${clientIP} | Error: ${err.message}`)
        hostnames = []
      }
    }

    console.info(`Crawler Detected, {
      event: 'crawler_access',
      userAgent: ${userAgent},
      clientIP: ${clientIP},
      hostnames: ${hostnames},
    }`)

    // Hostname Verification
    const crawlerName = matchedPattern?.source.toLowerCase()
    if (crawlerName && HOSTNAME_PATTERNS[crawlerName]) {
      const patterns = HOSTNAME_PATTERNS[crawlerName]
      const isValidHostname =
        hostnames.length === 0
          ? patterns.some((pattern) => pattern.test(clientIP)) // If reverse DNS fails, check IP directly against patterns
          : hostnames.some((hostname) => patterns.some((pattern) => pattern.test(hostname))) // Otherwise check hostnames as before

      if (!isValidHostname) {
        console.warn(`Hostname verification failed for crawler: ${userAgent} | IP: ${clientIP}`)
        setResponseStatus(event, 403)
        send(event, '403 Forbidden')
        return
      }
    }
  }

  // Access Control Logic
  if (isCrawler && !isAllowedCrawler) {
    console.warn(`Unrecognized crawler detected: ${userAgent} | IP: ${clientIP}`)
    setResponseStatus(event, 403)
    send(event, '403 Forbidden')
    return
  }

  if (pathDepth > MAX_PATH_DEPTH) {
    console.warn(`Accessing deep path: ${path} | IP: ${clientIP}`)
    setResponseStatus(event, 403)
    send(event, '403 Forbidden')
    return
  }

  // Continue processing the request
})
