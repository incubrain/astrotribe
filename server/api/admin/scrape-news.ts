import { newsListGovernment } from '@/types/news'

export default defineEventHandler(async (event) => {
  try {
    for (const news of newsListGovernment) {
      await newsScraper(event, news)
    }

    return {
      status: 200,
      message: 'News scraped and stored in supabase'
    }
  } catch (error: any) {
    console.error('scrape-news error', error.message)
    return {
      status: 500,
      message: 'Error storing news',
      error
    }
  }
})
