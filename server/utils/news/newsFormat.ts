import type { NewsType, NewsScrapedType } from '@/types/news'
import type { AuthorType } from '@/types/authors'

const formatMedia = (images: any, videos: any) => {
  const media = [...(images || []), ...(videos || [])]
  if (media.length === 0) return null

  return media.map((mediaItem: { src: string; alt: string; caption: string; credit: string }) => ({
    src: mediaItem.src,
    alt: mediaItem.alt || null,
    caption: mediaItem.caption || null,
    credit: mediaItem.credit || null
  }))
}

// The goal of this function is to take the scraped data and format it to match the News database table
const newsFormat = (
  scrapedData: NewsScrapedType[]
): {
  newsPost: Partial<NewsType>[]
  authors: Partial<AuthorType>[]
} => {
  const newsPosts: Partial<NewsType>[] = []
  const authors: Partial<AuthorType>[] = []

  for (const data of scrapedData) {
    const newsPost: Partial<NewsType> = {
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at,
      title: data.title,
      link: data.link,
      body: data.body || undefined,
      media: formatMedia(data.images, data.videos),
      category_id: 31 // or determine category from the scraped data
    }
    newsPosts.push(newsPost)

    if (data.author) {
      const author: Partial<AuthorType> = {
        name: data.author.name || null,
        link: null,
        image: data.author.image || null
      }
      authors.push(author)
    }
  }

  return { newsPost: newsPosts, authors }
}

export default newsFormat
