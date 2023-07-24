export default defineEventHandler(async () => {
  try {
    const e = await import('@/data/app/events.json')
    const v = await import('@/data/app/venues.json')
    const h = await import('@/data/app/hosts.json')

    const events = e.default.map((i) => {
      return {
        venue: v.default.find((iv) => iv.id === i.venue_id),
        hosts: h.default.filter((ih) => i.event_hosts.includes(ih.id)),
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
