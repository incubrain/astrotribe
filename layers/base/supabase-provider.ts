export function getImage(
  src: string,
  {
    modifiers = { width: null, height: null, format: null },
    baseURL = process.env.NUXT_PUBLIC_SUPABASE_URL,
  } = {},
) {
  const { width, height, format } = modifiers
  const [_, bucket, sizeName, imageFileName] = src.split('/')

  // Determine target size
  let targetSizeName = sizeName
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

  return {
    url: `${baseURL}/storage/v1/object/public/${bucket}/${targetSizeName}/${imageNameWithoutExt}.${imageFormat}`,
  }
}
