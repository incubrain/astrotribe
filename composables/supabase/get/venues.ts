import { FileObject } from '@supabase/storage-js'
import publicClient from '../publicClient'

const client = publicClient()

export const venuesSingle = async (venueId: number) => {
  const { data, error } = await client.rpc('get_venue_single', { venueId })
  console.log('venueById', data, error)
  return {
    data,
    error
  }
}

export const venuesMany = async () => {
  const { data, error } = await client.rpc('get_venues_many')
  console.log('venuesMany', data, error)

  return {
    data,
    error
  }
}

const baseUrl = 'https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/'

export async function getVenueImages(venueId: number): Promise<string[]> {
  const { data, error } = await client.storage.from('venues-public').list(`${venueId}/`)

  if (error) {
    console.error('Error fetching venue images:', error)
    return []
  }

  // If you want to store full URLs
  const imageUrls = data.map((file: FileObject) => `${baseUrl}${file.name}`)

  return imageUrls
}
