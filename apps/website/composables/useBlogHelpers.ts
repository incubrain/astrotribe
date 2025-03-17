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

    // Return the full path for the article
    return article.path
  }

  return {
    getSlugFromPath,
    getArticleUrl,
  }
}
