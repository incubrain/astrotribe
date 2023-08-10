import { SettingsAccountValidation, SettingsPasswordValidation, SettingsAccount, SettingsPassword } from '@/types/settings'

function validateSettingsData(settingsType: string, data: SettingsAccount | SettingsPassword): any {
  switch (settingsType) {
    case 'account':
      return SettingsAccountValidation.parse(data)
    case 'password':
      return SettingsPasswordValidation.parse(data)
    default:
      throw createError(`Error validating ${settingsType} settings data`)
  }
}

export default defineEventHandler(async (event) => {
  let status
  let message
  let data
  // TODO: make this endpoint dynamic, we should be able to update each settings tab based on a type passed in body
  // TODO: pass id in post body
  // TODO: dynamically choose the table to update based on the type passed in body

  const body = await readBody(event)
  console.log('updating user', body)
  const { id } = event.context.params
  console.log('getting user', id)
  
  // TODO: use zod to validate the body data
  const validatedData = validateSettingsData(body.settingsType, body.data)

  const client = useClient()

  try {
    // Update the user data in the Supabase table
    const user = await client.users.update({
      where: {
        id: body.id
      },
      data: {
        // fetching the body data from the request and update the user
        ...validatedData
      }
    })

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
