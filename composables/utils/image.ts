import { stringIsNull } from '~/composables/utils/strings'

export type FileType =
  | 'venue-logo'
  | 'venue-featured-image'
  | 'venue-images'
  | 'event-featured-image'
  | 'event-images'
  | 'user-avatar'
  | 'user-cover'

// Map this to supabase storage bucket structures
export const defaultFileOptions: Record<FileType, string> = {
  'venue-logo': 'logo.jpg',
  'venue-featured-image': 'featured-image.jpg',
  'venue-images': 'images/',
  'event-featured-image': 'events/featured-image.jpg',
  'event-images': 'images/',
  'user-avatar': 'avatar.jpg',
  'user-cover': 'cover.jpg'
}

export interface UrlConstructorOptions {
  baseURL: string
  bucket: 'profile-public' | 'posts' | 'venues'
  file: string | null
  folderPath: string
  fileType: FileType
  isPrivate?: boolean
  transform?: {
    width?: number
    height?: number
    fit?: 'contain' | 'cover' | 'fill'
    quality?: number
  } | null
}

export const constructUrl = (options: UrlConstructorOptions) => {
  const {
    baseURL,
    bucket,
    file,
    folderPath,
    fileType,
    isPrivate = false,
    transform = null
  } = options

  let filePath = `${folderPath}/${file}`
  if (stringIsNull(file) && fileType) {
    filePath = `defaults/${defaultFileOptions[fileType]}`
  }

  const accessType = isPrivate ? 'private' : 'public'
  const path = transform
    ? `/render/image/${accessType}/${bucket}/${filePath}`
    : `/storage/v1/object/${accessType}/${bucket}/${filePath}`
  const url = new URL(path, baseURL)

  if (transform) {
    Object.entries(transform).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  return url.href
}

export interface GetImageUrlOptions extends Omit<UrlConstructorOptions, 'baseURL'> {}

export const getImageURL = ({
  bucket,
  file,
  fileType,
  folderPath,
  isPrivate,
  transform
}: GetImageUrlOptions): string => {
  const baseURL = useRuntimeConfig().public.SUPABASE_URL

  return constructUrl({
    baseURL,
    bucket,
    file,
    fileType,
    folderPath,
    isPrivate,
    transform
  })
}

export interface GetStorageImagesOptions extends Omit<UrlConstructorOptions, 'baseURL' | 'file'> {}

// export async function getStorageImages(options: GetStorageImagesOptions): Promise<string[]> {
//   const { bucket, fileType, folderPath, isPrivate, transform } = options
//   const baseURL = useRuntimeConfig().public.SUPABASE_URL
//   if (!bucket || !folderPath) {
//     console.error('Bucket and folder are required parameters')
//     return []
//   }

//   const images: string[] = []

//   const { data, error } = await client.storage.from(bucket).list(folderPath)

//   if (error) {
//     console.error(`Error fetching images from ${bucket}:`, error)
//     return []
//   }

//   if (!data || data.length === 0) {
//     console.info(`No data returned from Supabase for bucket ${bucket}`)

//     // use constructUrl to create a default image URL
//     const defaultUrlOptions: UrlConstructorOptions = {
//       baseURL,
//       bucket,
//       file: null,
//       folderPath: '',
//       fileType,
//       isPrivate
//     }
//     return [constructUrl(defaultUrlOptions)]
//   }

//   // If you want to store full URLs
//   await data.forEach((file: FileObject) => {
//     if (!file.name.startsWith('.')) {
//       // use constructUrl to create image URLs
//       const urlOptions: UrlConstructorOptions = {
//         baseURL,
//         bucket,
//         file: file.name,
//         folderPath,
//         fileType,
//         isPrivate,
//         transform
//       }
//       images.push(constructUrl(urlOptions))
//     }
//   })

//   return images
// }
