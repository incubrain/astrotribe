import axios from 'axios'
import sharp from 'sharp'
import { getSupabaseClient } from '@db'
import type { NewsType } from '@gen'

const config = {
  dimensions: {
    original: { width: 1920, height: 1080 }, // Full HD
    mobile: { width: 768, height: 1024 }, // Mobile optimized
    thumbnail: { width: 300, height: 200 }, // Thumbnail size
  },
  formats: ['webp', 'jpg'], // jpg as fallback
}

const log = getLogger()

const supabase = getSupabaseClient()

const MAX_CONCURRENT_TASKS = 5 // Adjust based on your system capabilities

export async function bulkImageProcessing() {
  try {
    log.info('Starting bulk image processing').tags(['bulkProcessing'])

    // Fetch news items that need image processing
    const newsItems = await fetchNewsItemsToProcess()

    if (newsItems.length === 0) {
      log.info('No news items to process').tags(['bulkProcessing'])
      return
    }

    // Process images with limited concurrency
    await processImagesInBatches(newsItems, MAX_CONCURRENT_TASKS)

    log.info('Bulk image processing completed').tags(['bulkProcessing'])
  } catch (error: any) {
    log.error('Error in bulkImageProcessing', { error }).tags(['bulkProcessing'])
  }
}

async function fetchNewsItemsToProcess(): Promise<NewsType[]> {
  try {
    const { data, error } = await supabase
      .from<NewsType>('news')
      .select('*')
      .like('featured_image', 'http%')
      .limit(100)

    if (error: any) {
      log.error('Error fetching news items', { error }).tags(['bulkProcessing'])
      throw error
    }

    log.info('Fetched news items to process', { count: data?.length || 0 }).tags(['bulkProcessing'])
    return data || []
  } catch (error: any) {
    log.error('Error in fetchNewsItemsToProcess', { error }).tags(['bulkProcessing'])
    throw error
  }
}

async function processImagesInBatches(newsItems: NewsType[], maxConcurrent: number) {
  const queue: Promise<void>[] = []

  for (const item of newsItems) {
    if (queue.length >= maxConcurrent) {
      await Promise.race(queue)
    }

    const task = processSingleImage(item)
      .catch((error: any) => {
        log.error('Error processing image', { itemId: item?.id, error }).tags(['bulkProcessing'])
      })
      .finally(() => {
        queue.splice(queue.indexOf(task), 1)
      })

    queue.push(task)
  }

  // Wait for all remaining tasks to complete
  await Promise.all(queue)
}

async function processSingleImage(newsItem: NewsType): Promise<void> {
  if (!newsItem) {
    log.warn('Invalid news item', { newsItem }).tags(['bulkProcessing'])
    return
  }

  const imageUrl = newsItem.featured_image
  const imageName = `news_${newsItem.id}`

  // Process the image
  const defaultImagePath = await handleImageProcessing(imageUrl!, imageName)

  // Update the news item with the new image path
  await updateNewsItem(newsItem.id!, { featured_image: defaultImagePath })

  log.info('Processed image for news item', { itemId: newsItem.id }).tags(['bulkProcessing'])
}

async function handleImageProcessing(imageUrl: string, imageName: string): Promise<string> {
  try {
    log.info('Starting image processing', { imageUrl, imageName }).tags(['processing'])

    // Fetch the image
    const imageBuffer = await fetchImage(imageUrl)

    // Process and store the image, returning the default image path
    const defaultImagePath = await processAndStoreImage(imageBuffer, imageName)

    log.info('Image processing completed', { imageName }).tags(['processing'])

    return defaultImagePath
  } catch (error: any) {
    log.error('Error in handleImageProcessing', { error }).tags(['processing'])
    throw error
  }
}

async function fetchImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    log.info('Image fetched successfully', { url }).tags(['fetchImage'])
    return Buffer.from(response.data, 'binary')
  } catch (error: any) {
    log.error('Error fetching image', { url, error }).tags(['fetchImage'])
    throw error
  }
}

async function processAndStoreImage(imageBuffer: Buffer, imageName: string): Promise<string> {
  let defaultImagePath = ''

  for (const [sizeName, size] of Object.entries(config.dimensions)) {
    for (const format of config.formats) {
      try {
        // Resize and convert the image
        const processedImageBuffer = await sharp(imageBuffer)
          .resize(size.width, size.height, { fit: 'inside' })
          .toFormat(format as keyof sharp.FormatEnum)
          .toBuffer()

        // Define the storage path
        const filePath = `${sizeName}/${imageName}.${format}`

        // Upload the image to Supabase storage
        const { error } = await supabase.storage
          .from('news')
          .upload(filePath, processedImageBuffer, {
            contentType: `image/${format}`,
            upsert: true,
          })

        if (error: any) {
          log.error('Error uploading image', { filePath, error }).tags(['upload'])
        } else {
          log.info('Image uploaded successfully', { filePath }).tags(['upload'])

          // Set default image path to 'original' size and 'jpg' format
          if (sizeName === 'original' && format === 'jpg') {
            defaultImagePath = `news/${filePath}` // e.g., 'news/original/news_123.jpg'
          }
        }
      } catch (error: any) {
        log.error('Error processing image', { imageName, error }).tags(['processing'])
      }
    }
  }

  return defaultImagePath
}

async function updateNewsItem(id: string, updates: Partial<NewsType>): Promise<void> {
  const { error } = await supabase.from<NewsType>('news').update(updates).eq('id', id)

  if (error: any) {
    log.error('Error updating news item', { id, error }).tags(['bulkProcessing'])
    throw error
  }
}
