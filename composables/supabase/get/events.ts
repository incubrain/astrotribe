import publicClient from '../publicClient'

const client = publicClient()

export const getSingleEvent = async (eventId: number) => {
  const { data, error } = await client.rpc('get_single_event', { eventId })
  console.log('eventById', data, error)
  return {
    data,
    error
  }
}

export const eventsMany = async () => {
  const { data, error } = await client.rpc('get_many_events')

  console.log('eventsMany', data, error)

  return {
    data,
    error
  }
}
