export default defineEventHandler(async (event) => {
  console.log('scrape-blogs start')
  const params = getQuery(event)
  console.log('params', params)
  try {
    const storage = useStorage('blogs')

    // Save results to storage
    const currentDate = new Date().toISOString().slice(0, 10) // format as "YYYY-MM-DD"
    const items = await storage.getItem(
      `serp/${params.keyword.toLocaleLowerCase().replaceAll(' ', '-')}/${currentDate}.json`
    )

    return {
      status: 200,
      message: 'Blogs scraped',
      items
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
