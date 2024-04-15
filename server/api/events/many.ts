export default defineEventHandler(async () => {
  try {
    const e = await import('../data/events.json')
    const v = await import('../data/venues.json')
    const h = await import('../data/hosts.json')

    const events = e.default.map((i) => {
      return {
        venue: v.default.find((iv) => iv.id === i.venue_id),
        hosts: h.default.filter((ih) => i.event_hosts.includes(ih.id)),
        ...i
      }
    })

    return {
      status: 200,
      message: 'Events fetched',
      data: events
    }
  } catch (error: any) {
    return {
      status: 500,
      message: `Error getting events: ${error.message}`,
      data: null
    }
  }
})
