import { FileObject } from '@supabase/storage-js'

export const venueSingle = async (venueId: number) => {
  console.log('venueById', venueId)
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_venue_single', { p_venue_id: venueId })
  console.log('venueById2', data, error)
  return {
    data,
    error
  }
}

export const venuesMany = async () => {
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_venues_many')
  console.log('venuesMany', data, error)

  return {
    data,
    error
  }
}

const baseUrl = 'https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/'

export async function getVenueImages(venueId: number): Promise<string[]> {
  const client = usePublicClient()
  const s = useStorage()
  const { data, error } = await client.storage.from('venues').list(`${venueId}/images/`)
  console.log('getVenueImages', data, error)

  if (error) {
    console.error('Error fetching venue images:', error)
    return []
  }

  if (data === null || data === undefined || data.length === 0) {
    console.info('No data returned from Supabase')
    return ['https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/render/image/public/venues/defaults/featured-image.jpg?width=500&height=500&fit=cover&quality=80']
  }

  // If you want to store full URLs
  const filtered = data.filter((file: FileObject) => !file.name.startsWith('.'))
  const imageUrls = filtered.map((file: FileObject) =>
    s.image.optimized({
      bucket: 'venues',
      file: file.name,
      folderPath: `${venueId}/images`,
      fileType: 'venue-images',
      transform: {
        width: 300,
        height: 300,
        fit: 'cover',
        quality: 80
      }
    })
  )

  return imageUrls
}
