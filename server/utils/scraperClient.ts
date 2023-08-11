import { connect } from 'puppeteer'
const scraperClient = async () => {
  const env = useRuntimeConfig()
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  const client = await connect({
    // pass up all the console logs inside page.evaluate.
    browserWSEndpoint: `wss://${env.BRIGHT_DATA_BROWSER_USER}:${env.BRIGHT_DATA_BROWSER_PASS}@brd.superproxy.io:9222`
  })
  return client
}

export default scraperClient
