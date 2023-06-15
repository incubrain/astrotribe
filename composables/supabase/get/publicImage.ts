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
  if (transform.height || transform.width) {
    image = client.storage
      .from('profile-public')
      .getPublicUrl(`${userId}/${type}/${fileName}.png`, {
        transform
      })
  } else {
    image = client.storage.from('profile-public').getPublicUrl(`${userId}/${type}/${fileName}.png`)
  }

  console.log('profileSingle2', image)
  return {
    data: image.data
  }
}
