export default defineEventHandler(async () => {
  try {
    const e = await import('@/data/app/events.json')
    const v = await import('@/data/app/venues.json')

    const events = e.default.map((i) => {
      return {
        venue: v.default.find((it) => it.id === i.venue_id),
        ...i
      }
    })

    console.log('events', events)

    return {
      status: 200,
      message: 'Events fetched',
      events
    }
  } catch (error) {
    console.log('error', error)

    return {
      status: 500,
      message: 'Error getting events',
      events: undefined
    }
  }
})
