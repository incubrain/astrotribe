// server/api/bookmarks/counts.ts
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  console.log('fetch bookmark counts endpoint fired')
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const supabase = serverSupabaseServiceRole(event)

    // The get_bookmark_counts_by_folder function should be updated if necessary
    // to work with the new schema, but the interface remains the same
    const { data, error } = await supabase.rpc('get_bookmark_counts_by_folder', {
      user_id_param: user.id,
    })

    if (error) throw error

    console.log('FETCHED DATA', data?.length)

    // Transform the data to include uncategorized bookmarks
    const transformedData = data.map((item: any) => ({
      folder_id: item.folder_id || 'uncategorized',
      count: parseInt(item.count),
    }))

    console.log('TRANSFORMED DATA', transformedData)

    return { data: transformedData }
  } catch (error: any) {
    console.error('Error fetching bookmark counts:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
