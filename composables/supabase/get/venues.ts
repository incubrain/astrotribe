import publicClient from '../publicClient'

const client = publicClient()

export const venueById = async (venueId: string) => {
  const { data, error } = await client.rpc('get_single_venue', { venueId })
  console.log('venueById', data, error)
  return {
    data,
    error
  }
}

export const venuesMany = async () => {
  const { data, error } = await client.rpc('get_many_venues')
  console.log('venuesMany', data, error)

  return {
    data,
    error
  }
}
