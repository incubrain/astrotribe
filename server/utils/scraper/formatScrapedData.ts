import type { ScrapedLinkT, ScrapedPageT } from '@/types/news'

// Function to format images and videos into a standardized media format.
// const formatMedia = (media: any) => {
//   // Transform each media item to a standardized format.
//   return {
//     src: media.src || null,
//     alt: media.alt || null,
//     caption: media.caption || null,
//     credit: media.credit || null
//   }
// }

function cleanText(inputText: string) {
  // Trim leading and trailing whitespace
  console.log('inputText:', inputText)
  const trimmedText = inputText.trim()

  // Replace sequences of whitespace (including spaces, tabs, and new lines) with a single space
  const cleanedText = trimmedText.replace(/\s+/g, ' ')
  console.log('cleanedText:', cleanedText)

  return cleanedText
}

const handleDate = (rawDate: string) => {
  let publishedAt: string | null
  const dateFormat = /(\d{4}-\d{2}-\d{2})/
  const isDate = rawDate.match(dateFormat)

  if (isDate) {
    const date = new Date(isDate![1])
    publishedAt = date.toISOString()
  } else if (rawDate.includes('[release]')) {
    const formattedDate = rawDate.replace(/(\d+:\d+)?\s*\[.*\]/, '').trim()
    const date = new Date(formattedDate)
    publishedAt = date.toISOString()
  } else if (rawDate.includes('/')) {
    const [day, month, year] = rawDate.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    publishedAt = date.toISOString()
  } else if (rawDate.includes(',')) {
    const date = new Date(rawDate)
    publishedAt = date.toISOString()
  } else if (rawDate.includes('T')) {
    const date = new Date(rawDate)
    publishedAt = date.toISOString()
  } else {
    const date = new Date(Number(rawDate) * 1000)
    publishedAt = date.toISOString()
  }
  return publishedAt
}

const handleUrl = (url: string, baseUrl: string) => {
  console.log('url:', url, 'baseUrl:', baseUrl)
  if (url.startsWith('http')) {
    return url
  } else if (url.startsWith('//')) {
    return `https:${url}`
  } else if (url.startsWith('../')) {
    url.replaceAll('../', '')
    const newUrl = url.replaceAll('../', '')
    return `${baseUrl}${newUrl}`
  }
  return `${baseUrl}${url}`
}

const deleteItemsByKeywords = (items: any[]) => {
  const keywords = ['[video]', 'ESA_Multimedia']
  return items.filter((item) => {
    const title = item.title.toLowerCase()
    const url = item.url.toLowerCase()
    return !keywords.some(
      (keyword) => title.includes(keyword.toLowerCase()) || url.includes(keyword.toLowerCase())
    )
  })
}

const deleteDuplicates = (items: any[]) => {
  return items.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.title === item.title || i.url === item.url)
  )
}

export const formatLinks = (links: any[], baseUrl: string): ScrapedLinkT[] => {
  console.log('link', links)
  links = deleteItemsByKeywords(links)
  links = deleteDuplicates(links)
  return links.map((link) => {
    link.url = handleUrl(link.url, baseUrl)
    return link
  })
}

export const formatPages = (pages: any[], baseUrl: string): ScrapedPageT[] => {
  pages = deleteDuplicates(pages)

  return pages.map((page) => {
    if (page.featured_image) {
      page.featured_image = handleUrl(page.featured_image, baseUrl)
    }
    if (page.body) {
      page.body = cleanText(page.body)
    }
    page.published_at = handleDate(page.published_at)
    return page
  })
}
