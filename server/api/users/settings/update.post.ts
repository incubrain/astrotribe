import {
  SettingsAccountValidation,
  SettingsPasswordValidation,
  SettingsAccount,
  SettingsPassword
} from '@/types/settings'

// Validate the settings data based on the type
function validateSettingsData(settingsType: string, data: SettingsAccount | SettingsPassword): any {
  switch (settingsType) {
    case 'account':
      return SettingsAccountValidation.parse(data)
    case 'password':
      return SettingsPasswordValidation.parse(data)
    default:
      throw new Error(`Unsupported settings type: ${settingsType}`)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { data, settingsType } = await readBody(event)
    const validatedData = validateSettingsData(settingsType, data)
    const supabase = await supabaseServerClient(event)

    const user = await supabase.from('users').update(validatedData).eq('auth_id', data.id)
    if (!user) {
      throw new Error('Failed to update user in Supabase')
    }

    return {
      status: 200,
      message: 'User updated',
      user: handleBigInt(user)
    }
  } catch (error: any) {
    console.error('Error:', error.message)
    return {
      status: 500,
      message: error.message,
      user: undefined
    }
  }
})
