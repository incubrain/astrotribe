export default defineEventHandler(async () => {
  const data = await import('@/data/app/venues.json')
  // const client = useClient()
  // const admin = false
  const venues = data.default
  const status = 200
  const message = 'venues fetched'

  console.log('venues', venues)

  return {
    status,
    message,
    venues
  }
})
