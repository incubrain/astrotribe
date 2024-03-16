import { chromium } from 'playwright'
let client: any

const scraperClient = async () => {
  // Retrieve runtime configuration variables.
  if (client) return client

  // const env = useRuntimeConfig() // Assuming this function retrieves your configuration

  // Disable TLS/SSL certificate validation.
  // Warning: This makes the connection less secure.
  // Playwright does not have a direct way to disable TLS checks like Puppeteer.
  // This might need to be handled externally or by using browser launch arguments if necessary.

  // Establish a connection to a browser. This example uses Chromium.
  // You might need to adjust it based on your specific requirements, such as using web socket endpoint or browser server.
  client = await chromium.launch({
    headless: false, // Set false if you need a headful browser.
    args: ['--disable-web-security'] // This is one way to relax security settings, but use with caution.
    // For WebSocket or browser server connections, use chromium.connect({ wsEndpoint: 'your_websocket_endpoint' }) instead.
  })

  return client
}

export default scraperClient
