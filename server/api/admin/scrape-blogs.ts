import puppeteer from 'puppeteer'

export default defineEventHandler(async () => {
  console.log('scrape-blogs start')
  try {
    const browser = await puppeteer.launch({
      // pass up all the console logs inside page.evaluate.
      dumpio: true
    })
    const page = await browser.newPage()
    console.log('scrapeBlogs: browser init')

    const spaceDotCom = newsBlogs.find((blog) => blog.name === 'space.com')!
    console.log(`scrapeBlogs: scrape ${spaceDotCom.name}`)

    // const nasa = newsBlogs.find((blog) => blog.name === 'jwst-nasa-blog')!
    // console.log(`scrapeBlogs: scrape ${nasa.name}`)
    // const posts = await newsScraperNasa(page, nasa)
    const posts = await newsScraperSpaceCom(page, spaceDotCom, true)
    console.log('scraped blogs:', posts)
    // !todo: store in the DB no KV

    await browser.close()
    return {
      status: 200,
      message: 'Blogs scraped',
      posts
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
