// server/middleware/db-check.ts
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Database configuration:', {
        type: config.content?.database?.type,
        url: config.content?.database?.url,
      })
    }
  } catch (error: any) {
    console.error('Error checking database config:', error)
  }
})
