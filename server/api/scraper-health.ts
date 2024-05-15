import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  var token = jwt.sign({ sender: 'AstronEra' }, useRuntimeConfig().scraperKey, {
    algorithm: 'HS256'
  })

  const response = await $fetch('https://seashell-app-awo7z.ondigitalocean.app/health', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  console.log('response', response)

  if (response.error) {
    console.log(response)
    throw createError('there was an error with the /health endpoint')
  }

  return {
    data: response,
    message: 'healthy scraper'
  }
})
