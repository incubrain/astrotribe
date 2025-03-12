// server/api/bookmarks/index.ts
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const { folder_id = null, include_subfolders = false } = getQuery(event)
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    // Basic query without joins to reduce potential errors
    let query = supabase
      .from('bookmarks')
      .select(
        `
        id,
        user_id,
        content_id,
        content_type,
        created_at,
        updated_at,
        folder_id,
        metadata
      `,
      )
      .eq('user_id', user.id)

    // Apply folder filters
    if (folder_id) {
      if (include_subfolders) {
        // Get folder path for subfolder filtering
        const { data: folderData } = await supabase
          .from('bookmark_folders')
          .select('path')
          .eq('id', folder_id)
          .single()

        if (folderData?.path) {
          const { data: subFolderIds } = await supabase
            .from('bookmark_folders')
            .select('id')
            .like('path', `${folderData.path}%`)

          if (subFolderIds?.length) {
            query = query.in('folder_id', [folder_id, ...subFolderIds.map((f) => f.id)])
          } else {
            query = query.eq('folder_id', folder_id)
          }
        } else {
          query = query.eq('folder_id', folder_id)
        }
      } else {
        query = query.eq('folder_id', folder_id)
      }
    }

    query = query.order('created_at', { ascending: false })

    const { data: bookmarks, error: bookmarksError } = await query
    if (bookmarksError) {
      console.error('Bookmark query error:', bookmarksError)
      throw bookmarksError
    }

    if (!bookmarks?.length) return { data: [] }

    // Get folders data separately if needed
    const folderIds = bookmarks
      .map((b) => b.folder_id)
      .filter((id) => id !== null && id !== undefined)

    let folders = []
    if (folderIds.length > 0) {
      const { data: folderData, error: folderError } = await supabase
        .from('bookmark_folders')
        .select('id, name, color, is_favorite')
        .in('id', folderIds)

      if (!folderError) {
        folders = folderData
      } else {
        console.warn('Failed to fetch folder data:', folderError)
      }
    }

    const folderMap = (folders || []).reduce((map, folder) => {
      map[folder.id] = folder
      return map
    }, {})

    // Prepare the response without trying to join with contents
    const normalizedBookmarks = bookmarks.map((bookmark) => {
      return {
        id: bookmark.id,
        user_id: bookmark.user_id,
        content_id: bookmark.content_id,
        content_type: bookmark.content_type,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        folder_id: bookmark.folder_id,
        folder: bookmark.folder_id ? folderMap[bookmark.folder_id] || null : null,
        metadata: bookmark.metadata || {},
      }
    })

    return { data: normalizedBookmarks }
  } catch (error: any) {
    console.error('Error in bookmark endpoint:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
