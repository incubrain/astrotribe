import { News, NewsScraped } from '@/types/zod/news'

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
const scraperFormat = (scrapedData: NewsScraped[]): News[] => {
  return scrapedData.map((data) => ({
    created_at: data.created,
    updated_at: data.updated || data.created,
    title: data.title,
    link: data.link,
    embedding: null,
    tags: [
      {
        id: 52,
        name: 'No Tags'
      }
    ],
    category: {
      id: 31,
      name: 'Uncategorized'
    },
    author: data.author
      ? {
          name: data.author.name || null,
          link: null,
          image: data.author.image || null
        }
      : null,
    raw: {
      title: data.title || null,
      body: data.body || null
    },
    media: formatMedia(data.images, data.videos),
    summary: {
      beginner: ['default content'],
      intermediate: ['default content'],
      expert: ['default content']
    },
    oldSummaries: [
      {
        beginner: ['default content'],
        intermediate: ['default content'],
        expert: ['default content']
      }
    ]
  }))
}

export default scraperFormat
