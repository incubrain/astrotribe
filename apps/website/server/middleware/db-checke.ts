// server/middleware/db-check.ts
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)
    console.log('DB URL:', config.content?.database?.url || 'Not configured')

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Database configuration:', {
        type: config.content?.database?.type    ,
        schema: config.content?.database?.schema,
        migration: !!config.content?.database?.migration,
      })
    }
  } catch (error) {
    console.error('Error checking database config:', error)
  }
})
