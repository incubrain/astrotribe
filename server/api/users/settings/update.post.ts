import {
  SettingsAccountValidation,
  SettingsPasswordValidation,
  SettingsAccount,
  SettingsPassword
} from '@/types/settings'

// Validate the settings data based on the type
function validateSettingsData(
  settingsType: string,
  data: SettingsAccount | SettingsPassword
): SettingsAccount | SettingsPassword {
  switch (settingsType) {
    case 'account':
      return SettingsAccountValidation.parse(data) as SettingsAccount
    case 'password':
      return SettingsPasswordValidation.parse(data) as SettingsPassword
    default:
      throw new Error(`Unsupported settings type: ${settingsType}`)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { data, settingsType } = await readBody(event)
    const validatedData = validateSettingsData(settingsType, data)
    const supabase = await supabaseServerClient(event)

    const { data: user, error } = await supabase
      .from('users')
      .update(validatedData)
      .eq('id', data.id)

    if (error) throw createError(`Error updating user: ${error.message}`)
    if (!user) {
      throw createError('Failed to update user in Supabase')
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
