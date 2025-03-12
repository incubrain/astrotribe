// server/routes/sitemap.ts
export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()
  const routes = new Set<string>()
  const cmsURL = 'http://localhost:1337'
  try {
    // 1. Fetch all articles
    const articlesResponse = await fetch(
      `${cmsURL}/api/articles?pagination[pageSize]=100&fields[0]=slug&fields[1]=category`,
    )
    const articlesData = await articlesResponse.json()

    // 2. Get categories and their article counts
    const categoryCount: Record<string, number> = {}
    articlesData.data.forEach((article: any) => {
      const category = article.attributes.category?.data?.attributes?.slug || 'all'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    // 3. Add category pagination routes
    Object.entries(categoryCount).forEach(([category, count]) => {
      const pages = Math.ceil(count / 10) // Assuming 10 articles per page
      for (let i = 1; i <= pages; i++) {
        routes.add(`/blog/category-${category}/page-${i}`)
      }
    })

    // 4. Add individual article routes
    articlesData.data.forEach((article: any) => {
      routes.add(`/blog/${article.attributes.slug}`)
    })

    return Array.from(routes)
  } catch (error) {
    console.error('Error generating sitemap routes:', error)
    return []
  }
})
