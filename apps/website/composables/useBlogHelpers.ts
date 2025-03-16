// composables/useArticleHelpers.ts
export function useBlogHelpers() {
  // Get slug from path
  const getSlugFromPath = (path: string) => {
    if (!path) return ''
    // Extract just the slug - the last part of the path
    const pathParts = path.split('/')
    return pathParts[pathParts.length - 1]
  }

  // Get URL for an article - flat URL structure
  const getArticleUrl = (article: any) => {
    if (!article?.path) return ''

    // Just use the slug for a clean URL
    const slug = getSlugFromPath(article.path)
    return article.path
  }

  return {
    getSlugFromPath,
    getArticleUrl,
  }
}
