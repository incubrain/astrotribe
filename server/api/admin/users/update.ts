export default defineEventHandler(async (event) => {
  console.log('update user endpoint fired')
  const { id, data } = await readBody(event)

  console.log('have body', data)

  try {
    return {
      error: null,
      data: [],
      status: 200,
      message: 'User fetched',
    }
  }
  catch (error: any) {
    console.error('update user error', error.message)
    return {
      error,
      data: null,
      status: 500,
      message: error.message,
    }
  }
})
