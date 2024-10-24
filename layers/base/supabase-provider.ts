import type { ImageProvider } from '@nuxt/image'

const supabaseProvider: ImageProvider = {
  getImage: (src, modifiers, options) => {
    // src is something like 'news/original/<news.id>.jpg'
    const [bucket, sizeName, imageFileName] = src.split('/')

    // Determine size folder based on modifiers
    let targetSizeName = sizeName
    const { width, height, format } = modifiers

    if (width && height) {
      if (width <= 300 && height <= 200) {
        targetSizeName = 'thumbnail'
      } else if (width <= 768 && height <= 1024) {
        targetSizeName = 'mobile'
      } else {
        targetSizeName = 'original'
      }
    }

    const imageNameWithoutExt = imageFileName.split('.')[0]
    const imageFormat = format || imageFileName.split('.')[1] || 'jpg'

    const imagePath = `${process.env.NUXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${targetSizeName}/${imageNameWithoutExt}.${imageFormat}`

    return {
      url: imagePath,
    }
  },
}

export default supabaseProvider
