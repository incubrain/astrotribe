export default defineEventHandler(async (event) => {
  try {
    await newsScraper(event)

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
