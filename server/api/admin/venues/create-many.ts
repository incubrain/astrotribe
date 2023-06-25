import supabaseClient from '../../../utils/supabaseClient'
import venues from '../../../../private-data/venues.json'

export default cachedEventHandler(async (event) => {
  const client = supabaseClient()
  let status: Number, message: String
  const { data, error } = await client.from('venues').insert(venues)
  console.log('venues', data, error)
  if (error) {
    status = 500
    message = 'Error creating venues'
  } else {
    status = 200
    message = 'Venues created'
  }
  console.log('venues status', status, message)
  return {
    status,
    message
  }
})
