export const profileSingle = ({
  userId,
  type,
  fileName,
  transform
}: {
  userId: number
  type: string
  fileName: string
  transform: { width: number; height: number }
}) => {
  // !todo: add dynamic transforms
  console.log('profileSingle', userId, type)
  const client = usePublicClient()
  let image
  if (fileName === 'default.png') {
    image = client.storage.from('profile-public').getPublicUrl(`defaults/avatar/${fileName}`)
  } else if (transform.height || transform.width) {
    image = client.storage
      .from('profile-public')
      .getPublicUrl(`${userId}/${type}/${fileName}`, {
        transform
      })
  } else {
    image = client.storage.from('profile-public').getPublicUrl(`${userId}/${type}/${fileName}`)
  }

  console.log('profileSingle2', image.data.publicUrl)
  const url = image.data.publicUrl as string
  return url
}
