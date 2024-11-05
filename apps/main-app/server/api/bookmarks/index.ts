import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

// server/api/bookmarks/index.ts
export default defineEventHandler(async (event) => {
  try {
    const { content_type = 'news', folder_id = null, include_subfolders = false } = getQuery(event)
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    // Simplify the query first to debug
    let query = supabase
      .from('bookmarks')
      .select(
        `
          *,
          folder:folder_id (
            id,
            name,
            color,
            path,
            is_favorite
          )
        `,
      )
      .eq('user_id', user.id)
      .eq('content_type', content_type)

    if (folder_id) {
      if (include_subfolders) {
        const { data: folderPath } = await supabase
          .from('bookmark_folders')
          .select('path')
          .eq('id', folder_id)
          .single()

        if (folderPath) {
          const { data: subFolders } = await supabase
            .from('bookmark_folders')
            .select('id')
            .eq('user_id', user.id)
            .like('path', `${folderPath.path}%`)

          const folderIds = subFolders?.map((f) => f.id) || []
          query = query.in('folder_id', [folder_id, ...folderIds])
        }
      } else {
        query = query.eq('folder_id', folder_id)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    }

    // If we got the bookmarks, now get the news content
    if (data && data.length > 0) {
      const contentIds = data.map((b) => b.content_id)
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .in('id', contentIds)

      if (newsError) {
        console.error('News fetch error:', newsError)
        throw createError({
          statusCode: 500,
          message: newsError.message,
        })
      }

      // Merge the news data with bookmarks
      const enrichedBookmarks = data.map((bookmark) => {
        const newsItem = newsData?.find((n) => n.id === bookmark.content_id)
        return {
          ...bookmark,
          news: newsItem,
        }
      })

      return { data: enrichedBookmarks }
    }

    return { data: data || [] }
  } catch (error) {
    console.error('Error in bookmark endpoint:', error)
    throw error
  }
})
