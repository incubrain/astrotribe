export default defineEventHandler(async () => {
  const data = await import('../data/venues.json')
  // const admin = false
  const venues = data.default
  const status = 200
  const message = 'venues fetched'

  return {
    status,
    message,
    data: venues
  }
})
