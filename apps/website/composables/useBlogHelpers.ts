// composables/useBlogHelpers.ts
export function useBlogHelpers() {
  // Get slug from path
  const getSlugFromPath = (path: string) => {
    if (!path) return ''
    // Extract just the slug - the last part of the path
    const pathParts = path.split('/')
    return pathParts[pathParts.length - 1]
  }

  // Get category from path
  const getCategoryFromPath = (path: string) => {
    if (!path) return ''
    // Extract the category - usually the second to last part
    const pathParts = path.split('/')
    return pathParts.length >= 3 ? pathParts[pathParts.length - 2] : ''
  }

  // Get URL for an article - can handle both old and new structure
  const getArticleUrl = (article: any) => {
    // If article already has a path, use it
    if (article?.path) return article.path

    // Otherwise, construct the path
    let category = ''

    // Get category from article.category
    if (typeof article.category === 'string') {
      // New structure - category is an ID/slug
      category = article.category
    } else if (article.category?.slug) {
      // Old structure - category is an object
      category = article.category.slug
    } else {
      // Fallback
      category = 'uncategorized'
    }

    // Get the slug
    const slug =
      article.stem?.split('/').pop() ||
      article._id?.split(':').pop() ||
      article.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    return `/blog/${category}/${slug}`
  }

  // Format tags consistently
  const formatTags = (tags: any) => {
    if (!tags) return []

    // Handle array of strings
    if (Array.isArray(tags) && typeof tags[0] === 'string') {
      return tags
    }

    // Handle array of objects with name property
    if (Array.isArray(tags) && typeof tags[0] === 'object') {
      return tags.map((tag) => tag.name)
    }

    return []
  }

  return {
    getSlugFromPath,
    getCategoryFromPath,
    getArticleUrl,
    formatTags,
  }
}
