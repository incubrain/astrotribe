import type { NewsType, NewsScrapedType } from '@/types/news'
import type { AuthorType } from '@/types/authors'

// Function to format images and videos into a standardized media format.
const formatMedia = (images: any, videos: any) => {
  // Combine images and videos into one array, handling null or undefined inputs.
  const media = [...(images || []), ...(videos || [])]

  // Return null if there are no media items to format.
  if (media.length === 0) return null

  // Transform each media item to a standardized format.
  return media.map((mediaItem: { src: string; alt: string; caption: string; credit: string }) => ({
    src: mediaItem.src, // Source URL of the media.
    alt: mediaItem.alt || null, // Alternate text, null if not provided.
    caption: mediaItem.caption || null, // Caption for the media, null if not provided.
    credit: mediaItem.credit || null // Credit for the media, null if not provided.
  }))
}

/// Function to format scraped data to match the structure of the News database table.
const newsFormat = (
  scrapedData: NewsScrapedType[]
): {
  newsPost: Partial<NewsType>[]
  authors: Partial<AuthorType>[]
} => {
  // Initialize arrays to store formatted news posts and authors.
  const newsPosts: Partial<NewsType>[] = []
  const authors: Partial<AuthorType>[] = []

  // Iterate over each piece of scraped data.
  for (const data of scrapedData) {
    // Format each news post.
    const newsPost: Partial<NewsType> = {
      created_at: data.created_at, // Creation date of the post.
      updated_at: data.updated_at || data.created_at, // Update date, fallback to created_at if not available.
      title: data.title, // Title of the news post.
      link: data.link, // Link to the original news post.
      body: data.body || undefined, // Body of the news post, undefined if not present.
      media: formatMedia(data.images, data.videos), // Formatted media items.
      category_id: 31 // Default category ID, can be dynamically determined.
    }
    // Add the formatted news post to the array.
    newsPosts.push(newsPost)

    // Process the author if available.
    if (data.author) {
      const author: Partial<AuthorType> = {
        name: data.author.name || null, // Name of the author, null if not available.
        link: null, // Link to the author's profile, null here.
        image: data.author.image || null // Image of the author, null if not available.
      }
      // Add the formatted author to the array.
      authors.push(author)
    }
  }

  // Return the formatted news posts and authors.
  return { newsPost: newsPosts, authors }
}

export default newsFormat
