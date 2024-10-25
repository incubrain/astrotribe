import fs from 'fs'
import fetch from 'node-fetch'

async function generateRoutes() {
  const strapiBaseUrl = process.env.NUXT_PUBLIC_STRAPI_URL || 'http://strapi:1337'
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
    const countData = await countRes.json()
    const totalCount = countData.meta.pagination.total
    const totalPages = Math.ceil(totalCount / pageSize)

    for (let page = 1; page <= totalPages; page++) {
      routes.push(`/blog/category/${category}/page/${page}`)
    }
  }

  fs.writeFileSync('prerender-routes.json', JSON.stringify(routes, null, 2))
}

generateRoutes()
