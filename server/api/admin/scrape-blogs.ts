import puppeteer from 'puppeteer'

export default defineEventHandler(async () => {
  console.log('scrape-blogs start')
  try {
    const browser = await puppeteer.launch({
      // pass up all the console logs inside page.evaluate.
      dumpio: true
    })
    const storage = useStorage('blogs')
    console.log('scrapeBlogs: browser init')

    for (const blog of scraperBlogs) {
      console.log(`scrapeBlogs: scrape ${blog.name}`)
      const posts = await scraperGeneric(browser, blog)
      console.log(`scrapeBlogs: store ${blog.name}`)
      await storage.setItem(`${blog.name}.json`, JSON.stringify(posts, null, 2))
    }

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
