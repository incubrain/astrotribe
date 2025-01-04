type FileType = 'venue-logo' | 'venue-featured-image' | 'venue-images' | 'user-avatar'

const defaultFileOptions: Record<FileType, string> = {
  'venue-logo': 'logo.jpg',
  'venue-featured-image': 'featured-image.jpg',
  'venue-images': 'images/',
  'user-avatar': 'avatar.jpg',
}

type BucketKey = 'profile-public' | 'posts' | 'venues'

const selectBucket: Record<FileType, BucketKey> = {
  'venue-logo': 'venues',
  'venue-images': 'venues',
  'venue-featured-image': 'venues',
  'user-avatar': 'profile-public',
}

interface UrlConstructorOptions {
  baseURL: string
  bucket: BucketKey
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

const stringIsNull = (value: any): boolean =>
  value === null || value === undefined || value === '' || value.length === 0

export const constructUrl = (options: UrlConstructorOptions) => {
  const {
    baseURL,
    bucket,
    file,
    folderPath,
    fileType,
    isPrivate = false,
    transform = null,
  } = options

  if (stringIsNull(file)) {
    console.log('No file provided, using default file for', fileType)
    return `images/defaults/${defaultFileOptions[fileType]}`
  }

  if (file && file.startsWith('http')) {
    return file
  }

  const filePath = `${folderPath}/${file}`
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

export interface GetImageUrlOptions
  extends Omit<UrlConstructorOptions, 'baseURL' | 'bucket' | 'isPrivate' | 'folderPath'> {
  data: any
}

function getFileProperty(fileType: FileType, data: any) {
  switch (fileType) {
    case 'user-avatar':
      return {
        file: data.avatar,
        fileCategory: 'avatar',
      }
    default:
      throw createError({ message: 'Invalid fileType in getFileProperty' })
  }
}

function formatImageInput(fileType: FileType, data: any) {
  const { file, fileCategory } = getFileProperty(fileType, data)
  return {
    bucket: selectBucket[fileType],
    folderPath: `${data.id}/${fileCategory}`,
    isPrivate: false,
    file,
  }
}

export const getImageURL = ({ data, fileType, transform }: GetImageUrlOptions): string => {
  const baseURL = useRuntimeConfig().public.supabaseURL
  const { bucket, folderPath, isPrivate, file } = formatImageInput(fileType, data)
  if (!baseURL) {
    throw createError({
      message: 'baseURL not defined in getImageURL',
    })
  }

  if (!fileType) {
    throw createError({ message: 'fileType is required in constructUrl' })
  }

  return constructUrl({
    baseURL,
    bucket,
    file,
    fileType,
    folderPath,
    isPrivate,
    transform,
  })
}

export interface GetStorageImagesOptions extends Omit<UrlConstructorOptions, 'baseURL' | 'file'> {}

// export async function getStorageImages(options: GetStorageImagesOptions): Promise<string[]> {
//   const { bucket, fileType, folderPath, isPrivate, transform } = options
//   const baseURL = useRuntimeConfig().public.supabaseURL
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
