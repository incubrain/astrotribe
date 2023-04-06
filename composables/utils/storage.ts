const baseUrl =
  'https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/'

const stringNullCheck = (input: string | null): boolean => {
  if (input === null) return false
  if (input === undefined) return false
  if (input.length === 0) return false
  if (input.startsWith('default')) return false
  else return true
}

export const getAvatar = (userId: number, avatar: string | null): string => {
  if (stringNullCheck(avatar)) {
    return `${baseUrl}profile-public/${userId}/avatar/${avatar}`
  } else return `${baseUrl}profile-public/defaults/avatar/default.png`
}

export const getCover = (userId: number, cover: string | null): string => {
  console.log('cover', cover)
  if (stringNullCheck(cover))
    return `${baseUrl}profile-public/${userId}/cover/${cover}`
  else return `${baseUrl}profile-public/defaults/cover/default.jpg`
}

export const getVenueFeatured = (
  venueId: number,
  featuredImage: string | null
): string => {
  if (stringNullCheck(featuredImage))
    return `${baseUrl}venues-public/${venueId}/featured/${featuredImage}`
  else return `${baseUrl}venues-public/defaults/featured_image.jpg`
}

export const getVenueLogo = (venueId: number, logo: string | null): string => {
  if (stringNullCheck(logo))
    return `${baseUrl}venues-public/${venueId}/logo/${logo}`
  else return `${baseUrl}venues-public/defaults/logo.png`
}
