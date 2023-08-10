import {
  SettingsAccountValidation,
  SettingsPasswordValidation,
  SettingsAccount,
  SettingsPassword
} from '@/types/settings'

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
  console.log('POST-USER')
  let status
  let message
  let returnData
  // TODO: dynamically choose the table to update based on the type passed in body

  const { data, id, settingsType } = await readBody(event)
  console.log('updating user', id)

  const validatedData = validateSettingsData(settingsType, data)

  const client = useClient()

  try {
    // Update the user data in the Supabase table
    const user = await client.users.update({
      where: {
        auth_id: String(id)
      },
      data: {
        // fetching the body data from the request and update the user
        ...validatedData
      }
    })
    console.log('data returned', user)
    if (user) {
      status = 200
      message = 'User updated'
      returnData = handleBigInt(user)
      console.log('parsed data')
    } else {
      console.log('error parsed data')
      status = 500
      message = 'Error updating user'
      returnData = undefined
    }

    return {
      status,
      message,
      user: returnData
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
