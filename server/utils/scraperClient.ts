import { connect } from 'puppeteer'
const scraperClient = async () => {
  // Retrieve runtime configuration variables.
  const env = useRuntimeConfig()

  // Disable TLS/SSL certificate validation.
  // Warning: This makes the connection less secure.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  // Establish a connection to a browser through a WebSocket endpoint.
  // This uses credentials from the environment configuration.
  const client = await connect({
    // We use Bright Data to enable IP rotation and other features that ensure we can securely scrape without getting blocked.
    browserWSEndpoint: `wss://${env.BRIGHT_DATA_BROWSER_USER}:${env.BRIGHT_DATA_BROWSER_PASS}@brd.superproxy.io:9222`
  })

  return client
}

export default scraperClient
