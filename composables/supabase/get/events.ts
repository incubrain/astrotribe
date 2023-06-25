export const getSingleEvent = async (eventId: number) => {
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_event_single', { eventId })

  return {
    data,
    error
  }
}

export const eventsMany = async () => {
  const client = usePublicClient()
  const { data, error } = await client.rpc('get_events_many')

  return {
    data,
    error
  }
}
