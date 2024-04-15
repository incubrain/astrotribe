import { NewsRepository } from '~/server/utils/news/news.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  console.log('get news', query)
  // if (!category) {
  //   throw createError({ message: 'No category provided' })
  // }

  if (!Array.isArray(query.filters)) {
    console.log('filters is not array')
    query.filters = [JSON.parse(query.filters)]
  }

  if (query.pagination) {
    console.log('pagination is not array')
    query.pagination = JSON.parse(query.pagination)
  }
  try {
    const client = new NewsRepository()
    const news = await client.selectNewsCards(query)

    return {
      status: 200,
      message: 'News retrieved from supabase',
      data: news
    }
  } catch (error: any) {
    console.error('get-news error', error.message)
    return {
      status: 500,
      message: 'Error retrieving news',
      data: null,
      error
    }
  }
})
