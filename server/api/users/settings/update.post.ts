import { SettingsAccountValidation, SettingsPasswordValidation } from '@/types/settings'
import type { SettingsAccountType, SettingsPasswordType } from '@/types/settings'

// Validate the settings data based on the type
function validateSettingsData(
  settingsType: string,
  data: SettingsAccountType | SettingsPasswordType
): SettingsAccountType | SettingsPasswordType {
  switch (settingsType) {
    case 'account':
      return SettingsAccountValidation.parse(data) as SettingsAccountType
    case 'password':
      return SettingsPasswordValidation.parse(data) as SettingsPasswordType
    default:
      throw new Error(`Unsupported settings type: ${settingsType}`)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { data, settingsType } = await readBody(event)
    const validatedData = validateSettingsData(settingsType, data)
    const supabase = await dbClient(event)

    const { data: user, error } = await supabase
      .from('users')
      .update(validatedData)
      .eq('email', validatedData.email)

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
