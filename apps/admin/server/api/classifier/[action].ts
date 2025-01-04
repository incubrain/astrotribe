import { defineEventHandler, getRouterParam, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const action = getRouterParam(event, 'action')
  console.log('Classifier action:', action)

  let url: string
  let label: string
  let id: string

  if (action !== 'select') {
    const body = await readBody(event)
    url = body.url
    label = body.label
    id = body.id
  }

  if (!action) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action is required',
    })
  }

  try {
    const token = jwt.sign({ sender: 'AstronEra' }, config.scraperKey, {
      algorithm: 'HS256',
    })

    if (action === 'insert') {
      const response = await $fetch(`${config.public.scraperURL}/api/classifier/urls`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, label }),
      })

      return {
        data: response,
      }
    } else if (action === 'delete') {
      const response = await $fetch(`${config.public.scraperURL}/api/classifier/urls/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        data: response,
      }
    } else if (action === 'select') {
      const response = await $fetch(`${config.public.scraperURL}/api/classifier/urls`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        data: response,
      }
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid action',
    })
  } catch (error: any) {
    console.error(`Error in classifier ${action}:`, error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
