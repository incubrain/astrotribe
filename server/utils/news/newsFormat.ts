import type { NewsCardScrapedT } from '@/types/news'

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

const handleDate = (rawDate: string) => {
  let publishedAt: string | null
  if (rawDate.includes('/')) {
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
    publishedAt = null
  }
  return publishedAt
}

const handleUrl = (url: string, baseUrl: string) => {
  if (url.startsWith('http')) {
    return url
  }
  return `${baseUrl}${url}`
}

const postCardFormat = (posts: any[], baseUrl: string) => {
  return posts.map((post) => {
    console.log('post', post)
    post.url = handleUrl(post.url, baseUrl)

    if (post.featured_image) {
      post.featured_image = handleUrl(post.featured_image, baseUrl)
    }

    if (!post.published_at) {
      return {
        ...post
      }
    }

    const publishedAt = handleDate(post.published_at)
    delete post.published_at
    return {
      published_at: publishedAt,
      ...post
    }
  })
}

/// Function to format scraped data to match the structure of the News database table.
const newsFormat = (
  rawPosts: NewsCardScrapedT[],
  baseUrl: string,
  type = 'card'
): NewsCardScrapedT[] | null => {
  switch (type) {
    case 'card':
      return postCardFormat(rawPosts, baseUrl)
    default:
      return null
  }
}

export default newsFormat
