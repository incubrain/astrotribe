import axios from 'axios'
import sharp from 'sharp'
import { serverSupabaseServiceRole } from '#supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

const config = {
  dimensions: {
    original: { width: 1920, height: 1080 }, // Full HD
    mobile: { width: 768, height: 1024 }, // Mobile optimized
    thumbnail: { width: 300, height: 200 }, // Thumbnail size
  },
  formats: ['webp', 'jpg'], // jpg as fallback
}

let supabase: SupabaseClient
const MAX_CONCURRENT_TASKS = 5 // Adjust based on your system capabilities

export async function bulkImageProcessing(event: any) {
  try {
    supabase = serverSupabaseServiceRole(event)
    console.log('Starting bulk image processing')

    // Fetch companies that need image processing
    const companies = await fetchCompaniesToProcess()

    if (companies.length === 0) {
      console.log('No companies to process')
      return
    }

    // Process images with limited concurrency
    await processImagesInBatches(companies, MAX_CONCURRENT_TASKS)

    console.log('Bulk image processing completed')
  } catch (error) {
    console.error('Error in bulkImageProcessing', { error })
  }
}

async function fetchCompaniesToProcess() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .like('logo_url', 'http%')
      .eq('content_status', 'published')
      .limit(100)

    if (error) {
      console.error('Error fetching companies', { error })
      throw error
    }

    console.log('Fetched company logos to process', { count: data?.length || 0 })

    return data || []
  } catch (error) {
    console.error('Error in fetchCompaniesToProcess', { error })
    throw error
  }
}

async function processImagesInBatches(companies: any[], maxConcurrent: number) {
  const queue: Promise<void>[] = []

  for (const item of companies) {
    if (queue.length >= maxConcurrent) {
      await Promise.race(queue)
    }

    const task = processSingleImage(item)
      .catch((error) => {
        console.error('Error processing image', { itemId: item?.id, error })
      })
      .finally(() => {
        queue.splice(queue.indexOf(task), 1)
      })

    queue.push(task)
  }

  // Wait for all remaining tasks to complete
  await Promise.all(queue)
}

async function processSingleImage(company: any): Promise<void> {
  if (!company) {
    console.warn('Invalid company', { company })
    return
  }

  const imageUrl = company.logo_url
  const imageName = `company_${company.id}`

  // Process the image
  const defaultImagePath = await handleImageProcessing(imageUrl!, imageName)

  // Update the company with the new image path
  await updateCompany(company.id!, { logo_url: defaultImagePath })

  console.log('Processed image for company', { itemId: company.id })
}

async function handleImageProcessing(imageUrl: string, imageName: string): Promise<string> {
  try {
    console.log('Starting image processing', { imageUrl, imageName })

    // Fetch the image
    const imageBuffer = await fetchImage(imageUrl)

    // Process and store the image, returning the default image path
    const defaultImagePath = await processAndStoreImage(imageBuffer, imageName)

    console.log('Image processing completed', { imageName })

    return defaultImagePath
  } catch (error) {
    console.error('Error in handleImageProcessing', { error })
    throw error
  }
}

async function fetchImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    console.log('Image fetched successfully', { url })
    return Buffer.from(response.data, 'binary')
  } catch (error) {
    console.error('Error fetching image', { url, error })
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
          .from('companies')
          .upload(filePath, processedImageBuffer, {
            contentType: `image/${format}`,
            upsert: true,
          })

        if (error) {
          console.error('Error uploading image', { filePath, error })
        } else {
          console.log('Image uploaded successfully', { filePath })

          // Set default image path to 'original' size and 'jpg' format
          if (sizeName === 'original' && format === 'jpg') {
            defaultImagePath = `company/${filePath}`
          }
        }
      } catch (error) {
        console.error('Error processing image', { imageName, error })
      }
    }
  }

  return defaultImagePath
}

async function updateCompany(id: string, updates: Partial<any>): Promise<void> {
  const { error } = await supabase.from<any>('companies').update(updates).eq('id', id)

  if (error) {
    console.error('Error updating company', { id, error })
    throw error
  }
}
