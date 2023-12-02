import puppeteer from 'puppeteer'
import { SupabaseClient } from '@supabase/supabase-js'
import serverSupabaseClient from '~/server/utils/useSupabaseClient'

export default defineEventHandler(async (event) => {
  const supabaseClient: SupabaseClient = await serverSupabaseClient(event)
  console.log('scrape-blogs start')
  try {
    const browser = await puppeteer.launch({
      // pass up all the console logs inside page.evaluate.
      // dumpio: true
    })
    const page = await browser.newPage()
    console.log('scrapeBlogs: browser init')

    const spaceDotCom = newsBlogs.find((blog) => blog.name === 'space.com')!
    console.log(`scrapeBlogs: scrape ${spaceDotCom.name}`)

    // const nasa = newsBlogs.find((blog) => blog.name === 'jwst-nasa-blog')!
    // console.log(`scrapeBlogs: scrape ${nasa.name}`)
    // const posts = await newsScraperNasa(page, nasa)

    const posts = await newsScraperSpaceCom(page, spaceDotCom, true)
    console.log('scrapeBlogs: posts', posts)

    const articleData = {
      title: posts[0].title,
      link: posts[0].link,
      author: posts[0].author,
      original: posts[0].body,
      published: posts[0].published,
      images: posts[0].images
    }

    try {
      await supabaseClient.from('articles').insert([articleData])
    } catch (error: any) {
      console.log('scrape-blogs error', error.message)
      throw new Error('error getting blogs: ' + error.value)
    }

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
