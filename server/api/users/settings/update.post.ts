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
  let status
  let message
  let returnData
  // TODO: dynamically choose the table to update based on the type passed in body

  const { data, settingsType } = await readBody(event)

  const validatedData = validateSettingsData(settingsType, data)

  const client = useClient()

  try {
    // Update the user data in the Supabase table
    const user = await client.users.update({
      where: {
        auth_id: String(data.id)
      },
      data: {
        // fetching the body data from the request and update the user
        ...validatedData
      }
    })
    if (user) {
      status = 200
      message = 'User updated'
      returnData = handleBigInt(user)
    } else {
      console.error('error parsed data')
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
