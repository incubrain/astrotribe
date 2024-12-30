import fs from 'fs'
import fetch from 'node-fetch'

async function generateRoutes() {
  const strapiBaseUrl = process.env.NUXT_PUBLIC_STRAPI_URL

  if (!strapiBaseUrl) {
    console.warn('Warning: NUXT_PUBLIC_STRAPI_URL is not defined')
    writeDefaultRoutes()
    return
  }

  console.log('Generating routes...', strapiBaseUrl)

  // Default static routes that should always be included
  const routes = ['/', '/about', '/contact', '/team', '/projects/dark-sky-conference-2023']

  try {
    const categories = [
      'all',
      'people-of-space',
      'space-exploration',
      'dark-sky-conservation',
      'sustainable-development',
    ]
    const pageSize = 10

    for (const category of categories) {
      let countQuery = '?pagination[pageSize]=0'
      if (category !== 'all') {
        countQuery += `&filters[category][slug][$eq]=${category}`
      }

      try {
        const response = await fetch(`${strapiBaseUrl}/api/articles${countQuery}`, {
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          console.warn(`Warning: Failed to fetch ${category} category data from Strapi`)
          continue
        }

        const countData = await response.json()
        const totalCount = countData.meta.pagination.total
        const totalPages = Math.ceil(totalCount / pageSize)

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          routes.push(`/blog/category-${category}/page-${pageNum}`)
        }
      } catch (error) {
        console.warn(`Warning: Error fetching ${category} category:`, error)
        continue
      }
    }
  } catch (error) {
    console.warn('Warning: Error generating dynamic routes:', error)
  }

  // Always write routes, even if only static ones
  writeRoutes(routes)
}

function writeDefaultRoutes() {
  const defaultRoutes = ['/', '/about', '/contact', '/team', '/projects/dark-sky-conference-2023']
  writeRoutes(defaultRoutes)
}

function writeRoutes(routes: string[]) {
  fs.writeFileSync('prerendered-routes.json', JSON.stringify(routes, null, 2))
  console.log(`Successfully wrote ${routes.length} routes to prerendered-routes.json`)
}

generateRoutes().catch((error) => {
  console.warn('Warning: Failed to generate routes:', error)
  writeDefaultRoutes()
})
