const baseUrl = 'https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/'

export const getAvatar = (userId: number, avatar: string | null): string => {
  if (avatar === null || avatar.startsWith('default')) return `${baseUrl}profile-public/defaults/avatar/default.png`
  else return `${baseUrl}profile-public/${userId}/avatar/${avatar}`
}

export const getVenueFeatured = (venueId: number, featuredImage: string | null): string => {
  if (featuredImage === null || featuredImage.startsWith('default')) return `${baseUrl}venues-public/defaults/featured_image.jpg`
  else return `${baseUrl}venues-public/${venueId}/featured/${featuredImage}`
}

export const getVenueLogo = (venueId: number, logo: string | null): string => {
  if (logo === null || logo.startsWith('default')) return `${baseUrl}venues-public/defaults/logo.png`
  else return `${baseUrl}venues-public/${venueId}/logo/${logo}`
}
