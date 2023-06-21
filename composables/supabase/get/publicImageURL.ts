export const publicImageURL = async ({
  bucket = 'profile-public',
  folderPath = 'defaults/avatar',
  file = 'default.png',
  transform
}: {
  bucket?: string
  folderPath: string
  file: string
  transform: { width?: number; height?: number; fit?: string; quality?: number } | null
}) => {
  const client = usePublicClient()

  if (folderPath) {
    file = `${folderPath}/${file}`
  }

  const image = await client.storage.from(bucket).getPublicUrl(file, { transform })

  return image.data.publicUrl as string
}
