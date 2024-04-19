import { NewsRepository } from '~/server/utils/news/news.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const parsedQuery = handleQueryParams(query)

  try {
    const newsRepository = new NewsRepository()
    const news = await newsRepository.selectNewsCards({
      tableName: 'news',
      selectStatement: newsRepository.dto.getSelect(parsedQuery.dto),
      pagination: parsedQuery.pagination,
      filterBy: parsedQuery.filterBy
    })

    return {
      status: 200,
      message: 'News retrieved from supabase',
      data: newsRepository.dto.validateAndFormatData({ data: news, dto: parsedQuery.dto })
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
