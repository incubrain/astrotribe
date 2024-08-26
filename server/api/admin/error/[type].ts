import { defineEventHandler, getRouterParam, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const type = getRouterParam(event, 'type')

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error type is required'
    })
  }

  console.log(`Sending error event to scraper for type: ${type}`)

  try {
    const token = jwt.sign({ sender: 'AstronEra' }, config.scraperKey, {
      algorithm: 'HS256'
    })

    const response = await $fetch(`${config.public.scraperUrl}/api/error/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {
      data: response
    }
  } catch (error: any) {
    console.error(`Error fetching ${type} data:`, error)

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) {
        // Handle 404 Not Found error
        return {
          data: null,
          error: `No ${type} data found for the specified parameters`
        }
      } else {
        // Handle other error statuses
        throw createError({
          statusCode: error.response.status,
          statusMessage: error.response.statusText || `Error fetching ${type} data`
        })
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable'
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error'
      })
    }
  }
})
