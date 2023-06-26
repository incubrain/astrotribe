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
