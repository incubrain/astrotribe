import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action } = body

  const scraperKey = useRuntimeConfig().scraperKey
  const token = jwt.sign({ sender: 'AstronEra' }, scraperKey, {
    algorithm: 'HS256',
  })

  const scraperBaseURL = useRuntimeConfig().public.scraperUrl

  let endpoint = ''
  switch (action) {
    case 'scrapeNewsLinks':
      endpoint = '/trigger/news_links'
      break
    case 'scrapeNewsArticles':
      endpoint = '/trigger/news_pages'
      break
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid action',
      })
  }

  try {
    const response = await $fetch(`${scraperBaseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error(`Error in scraper request: ${error}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error communicating with scraper',
    })
  }
})
