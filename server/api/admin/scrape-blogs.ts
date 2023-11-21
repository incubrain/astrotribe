import puppeteer from 'puppeteer'

export default defineEventHandler(async () => {
  console.log('scrape-blogs start')
  try {
    const browser = await puppeteer.launch({
      // pass up all the console logs inside page.evaluate.
      dumpio: true
    })
    console.log('scrapeBlogs: browser init')

    const spaceDotCom = newsBlogs.find((blog) => blog.name === 'space.com')!

    console.log(`scrapeBlogs: scrape ${spaceDotCom.name}`)
    const posts = await scraperGeneric(browser, spaceDotCom)
    console.log(`scraped blogs: ${posts}`)
    // !todo: store in the DB no KV

    await browser.close()
    return {
      status: 200,
      message: 'Blogs scraped'
    }
  } catch (error: any) {
    console.log('scrape-blogs error', error.message)
    return {
      status: 500,
      message: 'Error scraping blogs',
      error
    }
  }
})
