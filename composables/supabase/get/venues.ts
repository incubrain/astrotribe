export const venueSingle = async (venueId: number) => {
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_venue_single', { p_venue_id: venueId })
  return {
    data,
    error
  }
}

export const venuesMany = async () => {
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_venues_many')

  return {
    data,
    error
  }
}
