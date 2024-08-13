import { defineEventHandler, createEventStream } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const scraperBaseURL = useRuntimeConfig().public.scraperUrl
  const eventStream = createEventStream(event)

  const fetchJobMetrics = async () => {
    try {
      const metrics = await $fetch(`${scraperBaseURL}/api/jobs/metrics`)
      await eventStream.push(JSON.stringify(metrics))
    } catch (error) {
      console.error('Error fetching job metrics:', error)
    }
  }

  // Fetch initial metrics
  await fetchJobMetrics()

  // Fetch metrics every 5 seconds
  const interval = setInterval(fetchJobMetrics, 5000)

  eventStream.onClosed(async () => {
    console.log('Closing SSE connection...')
    clearInterval(interval)
    await eventStream.close()
  })

  return eventStream.send()
})
