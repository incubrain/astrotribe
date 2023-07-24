export default cachedEventHandler(async (event) => {
  const venues = null
  const admin = false
  let status = 400
  let message = 'You Are Not Authorized'
  if (admin && venues) {
    const client = supabaseClient()
    const { data, error } = await client.from('venues').insert(venues)
    if (error) {
      status = 500
      message = 'Error creating venues'
    } else {
      status = 200
      message = 'Venues created'
    }
  }
  return {
    status,
    message
  }
})
