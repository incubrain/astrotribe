import { useJwt } from '@vueuse/integrations/useJwt'

export default defineEventHandler(async (event) => {
  // todo:critical:easy:1 - use JWT for token
  const authorization = useRuntimeConfig().scraperKey

  const response = await $fetch('http://localhost:8080/health', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authorization}`
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
