// server/api/bookmarks/index.ts
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

interface BookmarkMetadata {
  title: string
  url: string
  description?: string
  featured_image?: string
  author?: string
  published_at?: string
}

function normalizeContent(content: any, contentType: string): BookmarkMetadata {
  switch (contentType) {
    case 'news':
      return {
        title: content.title,
        url: content.url,
        description: content.description,
        featured_image: content.featured_image,
        author: content.author,
        published_at: content.published_at,
      }
    case 'research':
      return {
        title: content.title,
        url: content.abstract_url,
        description: content.abstract,
        author: content.authors?.[0], // First author or handle array differently
        published_at: content.published_at,
      }
    case 'newsletters':
      return {
        title: content.title,
        url: content.url,
        description: content.generated_content,
        published_at: content.start_date,
      }
    case 'companies':
      return {
        title: content.name,
        url: content.url,
        description: content.description,
        featured_image: content.logo_url,
      }
    default:
      throw new Error(`Unknown content type: ${contentType}`)
  }
}

// server/api/bookmarks/index.ts
// server/api/bookmarks/index.ts
export default defineEventHandler(async (event) => {
  try {
    const { folder_id = null, include_subfolders = false } = getQuery(event)
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

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
        ),
        content:content_id (
          id,
          title,
          url,
          content_type,
          updated_at,
          created_at
        )
      `,
      )
      .eq('user_id', user.id)

    // Modify the query to fetch all bookmarks if no folder_id is provided
    if (folder_id) {
      if (include_subfolders) {
        // Always filter by a folder (either specified or default)
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

          query = query.in('folder_id', [
            folder_id,
            ...(subFolderIds?.map((f) => f.id) || []),
          ])
        } else {
          query = query.eq('folder_id', folder_id)
        }
      } else {
        query = query.eq('folder_id', folder_id)
      }
    }

    query = query.order('created_at', { ascending: false })

    const { data: bookmarks, error: bookmarksError } = await query
    if (bookmarksError) throw bookmarksError

    if (!bookmarks?.length) return { data: [] }

    // Group bookmarks by content_type for fetching related data
    const bookmarksByType = bookmarks.reduce(
      (acc, bookmark) => {
        const type = bookmark.content_type
        if (!acc[type]) acc[type] = []
        acc[type].push(bookmark.content_id)
        return acc
      },
      {} as Record<string, string[]>,
    )

    // Fetch all content type specific data in parallel
    const contentTypeData: Record<string, any[]> = {}
    await Promise.all(
      Object.entries(bookmarksByType).map(async ([type, ids]) => {
        const { data, error } = await supabase.from(type).select('*').in('id', ids)
        if (error) throw error
        contentTypeData[type] = data || []
      }),
    )

    // Normalize and merge the data
    const normalizedBookmarks = bookmarks.map((bookmark) => {
      const typeSpecificContent = contentTypeData[bookmark.content_type]?.find(
        (c) => c.id === bookmark.content_id,
      )
      const newMetadata = typeSpecificContent
        ? normalizeContent(typeSpecificContent, bookmark.content_type)
        : null

      return {
        id: bookmark.id,
        user_id: bookmark.user_id,
        content_id: bookmark.content_id,
        content_type: bookmark.content_type,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        folder_id: bookmark.folder_id,
        folder: bookmark.folder,
        metadata: {
          ...bookmark.metadata,
          ...newMetadata,
        },
      }
    })

    console.log('Normalized bookmarks:', normalizedBookmarks)

    return { data: normalizedBookmarks }
  } catch (error) {
    console.error('Error in bookmark endpoint:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
