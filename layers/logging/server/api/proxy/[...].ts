// server/api/proxy/[...].ts
import { getRequestURL, getQuery, readBody, getHeaders, defineEventHandler, createError } from 'h3'
import { tracedRequest } from '../../utils/tracer'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const url = getRequestURL(event)
    const method = event.method
    const query = getQuery(event)
    const headers = getHeaders(event)
    const body = method !== 'GET' ? await readBody(event) : undefined

    // Get Supabase client and session
    const client = await serverSupabaseClient(event)
    const {
      data: { session },
    } = await client.auth.getSession()

    if (!session?.access_token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - No valid session',
      })
    }

    const targetUrl = headers['x-target-url']
    if (!targetUrl) {
      throw createError({
        statusCode: 400,
        message: 'Missing target URL',
      })
    }

    const apiPath = url.pathname.replace('/api/proxy', '')

    const traceAttributes = {
      'proxy.target_url': `${targetUrl}${apiPath}`,
      'proxy.original_path': url.pathname,
      'proxy.query_params': Object.keys(query).join(','),
      'client.user_agent': headers['user-agent'] || '',
      'client.ip': headers['x-forwarded-for'] || headers['x-real-ip'] || '',
      'auth.user_id': session.user.id,
    }

    // Forward the request with the server-side obtained token
    const response = await tracedRequest({
      method,
      path: `${targetUrl}${apiPath}`,
      body,
      headers: {
        ...headers,
        'Authorization': `Bearer ${session.access_token}`,
        'x-forwarded-for': headers['x-forwarded-for'] || '',
        'x-real-ip': headers['x-real-ip'] || '',
      },
      spanName: `PROXY ${method} ${apiPath}`,
      attributes: traceAttributes,
    })

    return response
  } catch (error: any) {
    const statusCode = error.status || 500
    const message = error.message || 'Internal Server Error'

    throw createError({
      statusCode,
      message,
      data: {
        path: getRequestURL(event).pathname,
        method: event.method,
      },
    })
  }
})
