import { chromium } from 'playwright'

let client: any
const scraperClient = async () => {
  // Retrieve runtime configuration variables.
  // if (client) return client

  // chromium.use(StealthPlugin())

  // chromium.plugins.setDependencyDefaults('stealth/evasions/webgl.vendor', {
  //   vendor: 'Bob',
  //   renderer: 'Alice'
  // })

  // const env = useRuntimeConfig() // Assuming this function retrieves your configuration

  // Disable TLS/SSL certificate validation.
  // Warning: This makes the connection less secure.
  // Playwright does not have a direct way to disable TLS checks like Puppeteer.
  // This might need to be handled externally or by using browser launch arguments if necessary.

  // Establish a connection to a browser. This example uses Chromium.
  // You might need to adjust it based on your specific requirements, such as using web socket endpoint or browser server.
  const browser = await chromium.launch({
    headless: false // Set false for testing
  })

  client = await browser.newContext({
    // Specify English as the preferred language
    locale: 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  })

  return client
}

export default scraperClient
