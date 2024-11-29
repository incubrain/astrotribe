// server/api/bookmarks/index.ts
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

interface BookmarkMetadata {
  title: string
  url: string
  description?: string
  featured_image?: string
  author?: string
  published_at?: string
  score?: number
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
        score: content.score,
      }
    case 'research':
      return {
        title: content.title,
        url: content.abstract_url,
        description: content.abstract,
        author: content.authors?.[0], // First author or handle array differently
        published_at: content.published_at,
        doi_url: content.doi_url,
        published_in: content.published_in,
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
        category: content.category,
        founding_year: content.founding_year,
      }
    default:
      throw new Error(`Unknown content type: ${contentType}`)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { content_type = 'news', folder_id = null, include_subfolders = false } = getQuery(event)
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    console.log('Query params:', { content_type, folder_id, include_subfolders })

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
      .order('created_at', { ascending: false })

    const { data: bookmarks, error: bookmarksError } = await query
    if (bookmarksError) throw bookmarksError

    if (!bookmarks?.length) return { data: [] }

    // Group bookmarks by content_type
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
        ...bookmark,
        metadata: {
          ...bookmark.metadata,
          ...newMetadata,
        },
        [bookmark.content_type]: typeSpecificContent,
      }
    })

    return { data: normalizedBookmarks }
  } catch (error) {
    console.error('Error in bookmark endpoint:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
