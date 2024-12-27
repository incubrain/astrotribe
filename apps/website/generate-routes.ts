import fs from 'fs'
import fetch from 'node-fetch'

async function generateRoutes() {
  const strapiBaseUrl = process.env.NUXT_PUBLIC_STRAPI_URL

  if (!strapiBaseUrl) {
    throw new Error('NUXT_PUBLIC_STRAPI_URL is not defined')
  }

  console.log('Generating routes...', strapiBaseUrl)

  const categories = [
    'all',
    'people-of-space',
    'space-exploration',
    'dark-sky-conservation',
    'sustainable-development',
  ]
  const routes = ['/', '/about', '/contact', '/team', '/projects/dark-sky-conference-2023']
  const pageSize = 10

  for (const category of categories) {
    let countQuery = '?pagination[pageSize]=0'
    if (category !== 'all') {
      countQuery += `&filters[category][slug][$eq]=${category}`
    }

    const countRes = await fetch(`${strapiBaseUrl}/api/articles${countQuery}`, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      console.warn('Strapi server not available, skipping route generation')
      return []
    }

    const countData = await countRes.json()
    const totalCount = countData.meta.pagination.total
    const totalPages = Math.ceil(totalCount / pageSize)

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      routes.push(`/blog/category-${category}/page-${pageNum}`)
    }
  }

  fs.writeFileSync('prerender-routes.json', JSON.stringify(routes, null, 2))
}

generateRoutes().catch((error: any) => {
  console.error(error)
  process.exit(1)
})
