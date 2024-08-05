import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const token = jwt.sign({ sender: 'AstronEra' }, useRuntimeConfig().scraperKey, {
    algorithm: 'HS256'
  })

  const response = await $fetch('https://seashell-app-awo7z.ondigitalocean.app/metrics', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  console.log('response', response)

  if (response.error) {
    console.log(response)
    throw createError('there was an error with the /metrics endpoint')
  }

  return {
    data: response,
    message: 'metrics returned from scraper'
  }
})
