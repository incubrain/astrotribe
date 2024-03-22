export default defineEventHandler(async (event) => {
  try {
    const posts = await newsScraper('jaxa')

    if (!posts) {
      createError('No Posts Returned from scraper')
    } else {
      console.log('posts', posts)

      await newsStorage(posts, event)
    }

    return {
      status: 200,
      message: 'News stored in supabase'
    }
  } catch (error: any) {
    console.error('store-news error', error.message)
    return {
      status: 500,
      message: 'Error storing news',
      error
    }
  }
})
