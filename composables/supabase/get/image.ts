interface UrlConstructorOptions {
  baseURL: string
  bucket?: string
  folderPath?: string
  file?: string
  isPrivate?: boolean
  transform?: { width?: number; height?: number; fit?: string; quality?: number } | null
}

export const urlConstructor = (options: UrlConstructorOptions) => {
  const {
    baseURL,
    bucket = 'profile-public',
    folderPath = 'defaults/avatar',
    file = 'default.png',
    isPrivate = false,
    transform = null
  } = options

  if (file === 'default.png') {
    return `${baseURL}${bucket}/defaults/${file}`
  }

  const accessType = isPrivate ? 'private' : 'public'
  const url = new URL(`${accessType}/${bucket}/${folderPath}/${file}`, baseURL)

  if (transform) {
    for (const [key, value] of Object.entries(transform)) {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    }
  }

  return url.href
}

// interface ImageUrlOptions {
//   bucket?: string
//   folderPath?: string
//   file?: string
//   isPrivate?: boolean
//   transform?: { width?: number; height?: number; resize?: string; quality?: number } | null
// }

export const getImageURL = ({
  bucket,
  folderPath,
  file = 'default.png',
  isPrivate,
  transform
}: {
  bucket?: string
  folderPath?: string
  file?: string
  isPrivate?: boolean
  transform?: { width?: number; height?: number; fit?: string; quality?: number } | null
}): string => {
  const superbaseURL = useRuntimeConfig().public.SUPABASE_URL
  const baseURL = `${superbaseURL}/storage/v1/render/image/`

  return urlConstructor({
    baseURL,
    bucket,
    folderPath,
    file,
    isPrivate,
    transform
  })
}
