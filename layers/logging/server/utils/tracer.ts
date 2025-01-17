// server/utils/tracer.ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api'
import { $fetch } from 'ofetch'

export const tracer = trace.getTracer('nuxt-proxy')

export interface TracedRequestOptions {
  method?: string
  path: string
  body?: any
  headers?: Record<string, string>
  spanName?: string
  attributes?: Record<string, string>
}

export async function tracedRequest({
  method = 'GET',
  path,
  body,
  headers = {},
  spanName,
  attributes = {},
}: TracedRequestOptions) {
  return tracer.startActiveSpan(spanName || `HTTP ${method}`, async (span) => {
    try {
      // Add basic span attributes
      span.setAttribute('http.method', method)
      span.setAttribute('http.url', path)

      // Add custom attributes
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value)
      })

      const response = await $fetch(path, {
        method,
        body,
        headers: {
          ...headers,
          traceparent: trace.getSpanContext(context.active())?.traceId || '',
        },
      })

      // Record response status
      span.setAttribute('http.status_code', 200)
      span.setStatus({ code: SpanStatusCode.OK })

      return response
    } catch (error: any) {
      // Record error details
      span.setAttribute('http.status_code', error.status || 500)
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      })
      span.recordException(error)
      throw error
    } finally {
      span.end()
    }
  })
}
