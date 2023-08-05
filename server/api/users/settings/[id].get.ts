export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const client = useClient()

  try {
    // TODO: get user settings from database
    return {
      status: 200,
      message: 'User settings fetched',
      settings
    }
  } catch (error) {
    // TODO: handle error
    return {
      status: 500,
      message: 'Error getting user settings'
    }
  }
})
