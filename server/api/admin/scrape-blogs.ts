export default defineEventHandler(async (event) => {
  console.log('scrape-blogs start')
  try {
    await newsScraper(event)

    console.log('scrape complete')
    return {
      status: 200,
      message: 'Blogs scraped'
    }
  } catch (error: any) {
    console.log('scrape-blogs api error', error.message)
    return {
      status: 500,
      message: 'Error scraping blogs',
      error
    }
  }
})
