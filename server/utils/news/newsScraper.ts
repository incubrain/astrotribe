// Define an asynchronous function for scraping news, with a default parameter to indicate test mode.
const newsScraper = async (isTest = true) => {
  // Log the start of the scraping process.
  console.log('scrape-blogs start')

  try {
    // Initialize the scraper client (browser instance).
    const browser = await scraperClient()
    // By default, set the blogs to scrape from a predefined list of news blogs.
    let blogs = newsBlogs
    console.log('newsScraper: browser init')

    // If in test mode, limit scraping to a specific blog (with id = 2) for testing purposes.
    if (isTest) blogs = [newsBlogs.find((blog) => blog.id === 2)!]
    console.log('newsScraper: blogs to scrape init', blogs)

    // Loop through each blog in the list.
    for (const blog of blogs) {
      // Log the start of scraping for each blog.
      console.log(`newsScraper: scrape ${blog.name}`)

      // Use the base scraping function to scrape posts from the current blog.
      const posts = await newsScraperBase(browser, blog)

      // Log the storing process for each blog.
      console.log(`newsScraper: store ${blog.name}`)

      // Loop through each post scraped from the blog.
      for (const post of posts) {
        // Log the post details.
        console.log(post)
        // Here, you would add logic to store the post in a database.
        // store in db
      }
    }

    // Close the browser instance after scraping is complete.
    await browser.close()
    // Log the completion of the scraping process.
    console.log('Blogs scraped')
  } catch (error: any) {
    // Log any errors that occur during the scraping process.
    console.log('scrape-blogs error', error.message)
  }
}

// !todo Schedule a cron job to run once per day
export default newsScraper
