export default defineEventHandler(async (event) => {
  const data = await readBody(event)

  console.log('SUPABASE DB WEBHOOK EVENT', data)
})
