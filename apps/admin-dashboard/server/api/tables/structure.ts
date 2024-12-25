// server/api/tables/structure.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { table_name } = getQuery(event)

  const { data, error } = await client.rpc('get_table_structure', {
    table_name,
  })

  if (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return data
})
