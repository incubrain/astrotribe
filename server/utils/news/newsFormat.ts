import type { NewsFullType, NewsScrapedType } from '@/types/news'

// Function to format images and videos into a standardized media format.
const formatMedia = (media: any) => {
  // Transform each media item to a standardized format.
  return {
    src: media.src || null,
    alt: media.alt || null,
    caption: media.caption || null,
    credit: media.credit || null
  }
}

/// Function to format scraped data to match the structure of the News database table.
const newsFormat = (rawPost: NewsScrapedType): NewsFullType => {
  // Format each news post.
  const date = new Date(rawPost.created_at)

  // Convert to an ISO 8601 string
  const formattedCreatedAt = date.toISOString()
  console.log('formattedCreatedAt:', formattedCreatedAt, rawPost.created_at)
  const newsPost: NewsFullType = {
    created_at: formattedCreatedAt,
    title: rawPost.title,
    url: rawPost.url,
    raw: {
      title: rawPost.title,
      body: rawPost.body
    },
    featured_image: formatMedia(rawPost.featured_image),
    category_id: 31,
    author: rawPost.author || null
  }

  return newsPost
}

export default newsFormat
