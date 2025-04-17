import { defineEventHandler, type H3Event } from 'h3'

// Load thresholds from environment variables or use default values
const THRESHOLD_REQUESTS_PER_MINUTE = Number(process.env.THRESHOLD_REQUESTS_PER_MINUTE ?? 100)
const THRESHOLD_UNIQUE_PATHS_PER_MINUTE = Number(
  process.env.THRESHOLD_UNIQUE_PATHS_PER_MINUTE ?? 50,
)
const THRESHOLD_DEPTH = Number(process.env.THRESHOLD_DEPTH ?? 6)

// Initialize counters
let requestCount = 0
const uniquePaths = new Set<string>()
let lastResetTime = Date.now()

// Function to reset counters
function resetCounters() {
  requestCount = 0
  uniquePaths.clear()
  lastResetTime = Date.now()
}

// Function to check for anomalies
function checkAnomalies(path: string): string[] {
  const now = Date.now()

  // Reset counters if more than a minute has passed
  if (now - lastResetTime > 60000) {
    resetCounters()
  }

  requestCount++
  uniquePaths.add(path)

  const pathDepth = path.split('/').filter(Boolean).length

  const anomalies: string[] = []

  if (requestCount > THRESHOLD_REQUESTS_PER_MINUTE) {
    anomalies.push(`High request rate: ${requestCount} requests/minute`)
  }

  if (uniquePaths.size > THRESHOLD_UNIQUE_PATHS_PER_MINUTE) {
    anomalies.push(`High number of unique paths accessed: ${uniquePaths.size} in the last minute`)
  }

  if (pathDepth > THRESHOLD_DEPTH) {
    anomalies.push(`Unusually deep path accessed: ${path} (depth: ${pathDepth})`)
  }

  return anomalies
}

function notifyAnomalies(anomalies: string[], logger: any) {
  logger.error(`Anomalies detected: ${anomalies}`)
  // Future implementation: Send notifications to monitoring services
}

// Define the middleware event handler
export default defineEventHandler((event: H3Event) => {
  const url = event.node.req.url || '/'
  const host = event.node.req.headers.host || 'localhost'
  const path = new URL(url, `http://${host}`).pathname

  if (import.meta.prerender) {
    return
  }

  console.info(`Traversing URL: ${url}, Host: ${host}, path: ${path}`)

  const anomalies = checkAnomalies(path)
  if (anomalies.length > 0) {
    notifyAnomalies(anomalies, console)
  }
})
