export default defineEventHandler(async (event) => {
  const routes = new Set<string>()

  try {
    // 1. Fetch all articles directly from Nuxt Content
    const articles = await queryCollection(event, 'blog').where('draft', '=', false).all()

    // 2. Get categories and their article counts
    const categoryCount: Record<string, number> = {}
    articles.forEach((article: any) => {
      const category = article.category?.slug || 'all'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    // 3. Add category pagination routes
    Object.entries(categoryCount).forEach(([category, count]) => {
      // Add main category page
      routes.add(`/blog/category/${category}`)

      // Add pagination pages (if needed)
      const pages = Math.ceil(count / 10) // Assuming 10 articles per page
      for (let i = 2; i <= pages; i++) {
        // Start from page 2 as page 1 is the main category page
        routes.add(`/blog/category/${category}/page/${i}`)
      }
    })

    // 4. Add individual article routes
    articles.forEach((article: any) => {
      if (article.path) {
        routes.add(article.path)
      }
    })

    return Array.from(routes)
  } catch (error: any) {
    console.error('Error generating sitemap routes:', error)
    return []
  }
})
