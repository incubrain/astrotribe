// src/debug.ts
import { chromium, firefox, webkit } from 'playwright'

/**
 * Test if Playwright is working properly by launching each browser type
 * and navigating to a simple URL
 */
async function testPlaywright() {
  console.log('Testing Playwright installations...')

  // Test Chromium
  try {
    console.log('Testing Chromium...')
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    console.log('Navigating to dhruvaspace.com...')
    await page.goto('http://dhruvaspace.com')
    console.log('Page title:', await page.title())

    await browser.close()
    console.log('Chromium test completed successfully ✅')
  } catch (error) {
    console.error('Chromium test failed ❌:', error)
  }

  // Test Firefox
  try {
    console.log('Testing Firefox...')
    const browser = await firefox.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    console.log('Navigating to dhruvaspace.com...')
    await page.goto('https://dhruvaspace.com')
    console.log('Page title:', await page.title())

    await browser.close()
    console.log('Firefox test completed successfully ✅')
  } catch (error) {
    console.error('Firefox test failed ❌:', error)
  }

  // Test WebKit
  try {
    console.log('Testing WebKit...')
    const browser = await webkit.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    console.log('Navigating to dhruvaspace.com...')
    await page.goto('https://dhruvaspace.com')
    console.log('Page title:', await page.title())

    await browser.close()
    console.log('WebKit test completed successfully ✅')
  } catch (error) {
    console.error('WebKit test failed ❌:', error)
  }
}

// Run the test
testPlaywright()
  .then(() => console.log('All tests completed'))
  .catch((error) => console.error('Test suite failed:', error))
