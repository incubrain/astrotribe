export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  console.log('updating user', id)

  const body = await readBody(event)
  console.log('body', body)

  const client = useClient()

  try {
    // Update the user data in the Supabase table
    const user = await client.users.update({
      where: {
        id
      },
      data: {
        // fetch the body data from the request and update the user
        given_name: body.given_name,
        surname: body.surname,
        email: body.email,
        introduction: body.introduction,
        quote: body.quote,
        updated_at: new Date()

      }
    })

    let status
    let message
    let data

    if (user) {
      status = 200
      message = 'User updated'
      data = JSON.stringify(user, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    } else {
      status = 500
      message = 'Error updating user'
      data = undefined
    }

    return {
      status,
      message,
      user: data ? JSON.parse(data) : undefined
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return {
      status: 500,
      message: 'Error updating user',
      user: undefined
    }
  }
})
