import { stringIsNull } from '~/composables/utils/strings'

type FileType =
  | 'venue-logo'
  | 'venue-featured-image'
  | 'venue-images'
  | 'event-featured-image'
  | 'event-images'
  | 'user-avatar'
  | 'user-cover'

// Map this to supabase storage bucket structures
export const defaultConstructorOptions: Record<FileType, string> = {
  'venue-logo': 'logo.jpg',
  'venue-featured-image': 'featured-image.jpg',
  'venue-images': 'images/',
  'event-featured-image': 'events/featured-image.jpg',
  'event-images': 'images/',
  'user-avatar': 'avatar.jpg',
  'user-cover': 'cover.jpg'
}

interface UrlConstructorOptions {
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

export const urlConstructor = (options: UrlConstructorOptions) => {
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
  console.log('filePath', fileType, file, stringIsNull(file))
  if (stringIsNull(file) && fileType) {
    filePath = `defaults/${defaultConstructorOptions[fileType]}`
  }

  const accessType = isPrivate ? 'private' : 'public'
  const url = new URL(`${accessType}/${bucket}/${filePath}`, baseURL)

  if (transform) {
    Object.entries(transform).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  return url.href
}

interface GetImageUrlOptions extends Omit<UrlConstructorOptions, 'baseURL'> {}

export const getImageURL = ({
  bucket,
  file,
  fileType,
  folderPath,
  isPrivate,
  transform
}: GetImageUrlOptions): string => {
  const superbaseURL = useRuntimeConfig().public.SUPABASE_URL
  const baseURL = `${superbaseURL}/storage/v1/render/image/`

  return urlConstructor({
    baseURL,
    bucket,
    file,
    fileType,
    folderPath,
    isPrivate,
    transform
  })
}
