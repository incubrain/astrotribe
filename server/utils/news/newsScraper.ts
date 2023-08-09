// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

const newsScraper = async (isTesting = true) => {
  console.log('scrape-blogs start')
  try {
    const browser = await scraperClient()
    let blogs = newsBlogs
    console.log('newsScraper: browser init')
    if (isTesting) blogs = [newsBlogs.find((blog) => blog.id === 2)!]
    console.log('newsScraper: blogs to scrape init', blogs)

    for (const blog of blogs) {
      console.log(`newsScraper: scrape ${blog.name}`)
      const posts = await newsScraperBase(browser, blog)
      console.log(`newsScraper: store ${blog.name}`)
      for (const post of posts) {
        // Assuming you have a 'blogs' table with fields 'name' and 'posts'
        // that are appropriate for your data
        console.log(post)
        // await prisma.news.create({
        //   data: {
        //     name: blog.name,
        //     posts: JSON.stringify(post, null, 2)
        //   }
        // })
      }
    }

    await browser.close()
    console.log('Blogs scraped')
  } catch (error: any) {
    console.log('scrape-blogs error', error.message)
  }
}

// Schedule the job to run at 12pm every day
export default newsScraper
