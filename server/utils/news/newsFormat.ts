import type { NewsCardScrapedT, NewsScrapedArticleT } from '@/types/news'

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
  console.log('rawDate:', rawDate)

  if (rawDate.includes('[release]')) {
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
  } else if (rawDate.includes('-')) {
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
  }
  return `${baseUrl}${url}`
}

const deleteItemsByKeywords = (items: any[]) => {
  const keywords = ['[video]', 'ESA_Multimedia']
  return items.filter((item) => {
    const title = item.title.toLowerCase()
    const url = item.url.toLowerCase()
    console.log('url:', url)
    return !keywords.some(
      (keyword) => title.includes(keyword.toLowerCase()) || url.includes(keyword.toLowerCase())
    )
  })
}

const deleteDuplicates = (items: any[]) => {
  return items.filter(
    (item, index, self) => index === self.findIndex((i) => i.title === item.title)
  )
}

const postCardFormat = (posts: any[], baseUrl: string): NewsCardScrapedT[] => {
  posts = deleteItemsByKeywords(posts)
  posts = deleteDuplicates(posts)
  return posts.map((post) => {
    post.url = handleUrl(post.url, baseUrl)
    return post
  })
}

const postArticleFormat = (posts: any[], baseUrl: string): NewsScrapedArticleT[] => {
  console.log('postArticleFormat', posts)
  posts = deleteDuplicates(posts)

  return posts.map((post) => {
    if (post.featured_image) {
      post.featured_image = handleUrl(post.featured_image, baseUrl)
    }
    if (post.body) {
      post.body = cleanText(post.body)
    }
    post.published_at = handleDate(post.published_at)
    return post
  })
}

/// Function to format scraped data to match the structure of the News database table.
const newsFormat = (
  rawPosts: NewsCardScrapedT[] | NewsScrapedArticleT[],
  baseUrl: string,
  type = 'card'
): NewsCardScrapedT[] | NewsScrapedArticleT[] => {
  switch (type) {
    case 'card':
      return postCardFormat(rawPosts, baseUrl)
    default:
      return postArticleFormat(rawPosts, baseUrl)
  }
}

export default newsFormat
