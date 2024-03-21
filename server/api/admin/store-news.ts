export default defineEventHandler(async (event) => {
  try {
    const posts = await newsScraper('csa')

    if (!posts) {
      createError('No Posts Returned from scraper')
    } else {
      console.log('posts', posts)

      // ensure that each post has a unique ur

      const uniquePosts = posts.filter((post, index, self) => {
        return (
          index ===
          self.findIndex((p) => {
            return p.url === post.url
          })
        )
      })

      await newsStorage(uniquePosts, event)
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
