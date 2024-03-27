import type { ScrapedLinkT, ScrapedPageT } from '@/types/news'
import { it } from 'node:test'

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
  const removeStart = ['Abstract Context:', 'Abstract:', 'Abstract']

  for (const start of removeStart) {
    if (inputText.startsWith(start)) {
      inputText = inputText.replace(start, '')
    }
  }
  // Trim leading and trailing whitespace
  const trimmedText = inputText.trim()

  // Replace sequences of whitespace (including spaces, tabs, and new lines) with a single space
  const cleanedText = trimmedText.replace(/\s+/g, ' ')

  return cleanedText
}

const handleDate = (rawDate: string) => {
  console.log('rawDate:', rawDate)
  let publishedAt: string | null
  const dateFormats = [
    /(\d{4}-\d{2}-\d{2})/, // eg. 2022-01-01
    /(\d{2} [A-Za-z]{3} \d{4})/ // eg. 01 Jan 2022
  ]
  let isDate: RegExpMatchArray | null = null
  for (const dateFormat of dateFormats) {
    isDate = rawDate.match(dateFormat)
    if (isDate) {
      break
    }
  }
  console.log('isDate:', isDate)
  if (isDate) {
    console.log('rawDate isDate:', rawDate)
    const date = new Date(isDate![1])
    publishedAt = date.toISOString()
  } else if (rawDate.includes('[release]')) {
    console.log('rawDate release:', rawDate)
    const formattedDate = rawDate.replace(/(\d+:\d+)?\s*\[.*\]/, '').trim()
    const date = new Date(formattedDate)
    publishedAt = date.toISOString()
  } else if (rawDate.includes('/')) {
    console.log('rawDate slash:', rawDate)
    const [day, month, year] = rawDate.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    publishedAt = date.toISOString()
  } else if (rawDate.includes(',')) {
    console.log('rawDate comma:', rawDate)
    const date = new Date(rawDate)
    publishedAt = date.toISOString()
  } else if (rawDate.includes('T')) {
    console.log('rawDate T:', rawDate)
    const date = new Date(rawDate)
    publishedAt = date.toISOString()
  } else {
    console.log('rawDate final:', rawDate)
    const date = new Date(Number(rawDate) * 1000)
    publishedAt = date.toISOString()
  }
  return publishedAt
}

const handleUrl = (url: string, baseUrl: string) => {
  if (baseUrl.startsWith('https://arxiv') && url.startsWith('/abs')) {
    // remove the version number from the url, v1, v12 etc.
    // !todo: currently we default to v1 of the paper, we need to handle newer versions
    return `https://arxiv.org${url.replace('/abs', '/html').replace(/v\d+$/, '')}`
  } else if (url.startsWith('http')) {
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
    const url = item.url.toLowerCase()
    if (!item.title) {
      return !keywords.some((keyword) => url.includes(keyword.toLowerCase()))
    }

    const title = item.title.toLowerCase()
    return !keywords.some(
      (keyword) => title.includes(keyword.toLowerCase()) || url.includes(keyword.toLowerCase())
    )
  })
}

const deleteDuplicates = (items: any[]) => {
  return items.filter((item, index, self) => {
    if (!item.title) {
      return index === self.findIndex((i) => i.url === item.url)
    }
    return index === self.findIndex((i) => i.title === item.title || i.url === item.url)
  })
}

const removeEmpty = (items: any[]) => {
  return items.filter((item) => {
    return item.title && item.url
  })
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
  console.log('pages:', pages.length)
  pages = deleteDuplicates(pages)
  pages = removeEmpty(pages)

  return pages.map((page) => {
    if (page.featured_image) {
      page.featured_image = handleUrl(page.featured_image, baseUrl)
    }

    if (page.body) {
      page.body = cleanText(page.body)
    }

    if (page.description) {
      page.description = cleanText(page.description)
    }

    page.published_at = handleDate(page.published_at)
    return page
  })
}
