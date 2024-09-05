import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const env = useRuntimeConfig().public
  const port = process.env.PORT

  try {
    // You can add more checks here, e.g., Redis connection, external API calls, etc.

    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    console.log('Health check successful', env)
    console.log('Process Port:', port)
    console.log('Nitro Port: ')

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      environment: process.env.NODE_ENV,
      databaseConnection: 'ok',
      responseTime: Date.now() - startTime,
    }
  }
  catch (error: any) {
    console.error('Health check failed:', error)

    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime,
    }
  }
})
