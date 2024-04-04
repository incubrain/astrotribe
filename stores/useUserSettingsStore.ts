import type { SettingsAccountType, SettingsPasswordType } from '@/types/settings'

const settingsTabs = [
  {
    slot: 'account',
    label: 'Account',
    icon: 'material-symbols:home'
  },
  {
    slot: 'password',
    label: 'Password',
    icon: 'material-symbols:key',
    disabled: true
  },
  {
    slot: 'application',
    label: 'Application',
    icon: 'material-symbols:laptop-mac-outline',
    disabled: true
  },
  {
    slot: 'notifications',
    label: 'Notifications',
    icon: 'material-symbols:notifications',
    disabled: true
  }
]

export default defineStore('settings', () => {
  // info: use reactive() to make the object reactive, ref is for primitive types
  // TypeScript supports 7 primitive types number, string, boolean, bigint, symbol, undefined, and null.
  const userAccountSettings = reactive({
    given_name: 'loading name',
    surname: 'loading surname',
    email: 'loading email',
    introduction: 'loading introduction',
    quote: 'loading quote'
  })

  const user = reactive({})
  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password'
  })
  // TODO: Add more settings as needed
  // const preferenceSettings = reactive({ theme: 'light', language: 'en' })
  // const notificationSettings = reactive({ email: true, push: false })

  function updateStateSettings(settings: any, newSettings: any) {
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(newSettings, key)) {
        // Using a type assertion to tell TypeScript that key is definitely a key of settings
        const typedKey = key as keyof typeof settings
        settings[typedKey] = newSettings[typedKey]
      }
    }
  }

  async function getUserSettings(id: string) {
    try {
      // TODO: get user settings from database
      const { data, error } = await useFetch(`/api/user/settings/${id}`)
      if (error.value) throw createError(`Error fetching user settings. Status: ${error.value}`)
      if (!data.value) throw createError('No user settings data returned from supabase')

      updateStateSettings(userAccountSettings, data.value.user)
      updateStateSettings(user, data.value.user)
    } catch (error) {
      console.error('Error fetching user settings:', error)
    }
  }

  interface UpdateAccountSettings extends SettingsAccountType {
    id: string
  }

  async function updateAccountSettings(newSettings: UpdateAccountSettings) {
    try {
      // Calling the API to update the account settings
      const { data, error } = await useFetch('/api/user/settings/update', {
        method: 'POST',
        body: JSON.stringify({
          settingsType: 'account',
          data: newSettings
        })
      })

      if (error.value) {
        throw createError(`Error updating account settings: ${error}`)
      }
      if (!data.value) throw createError('No data returned from supabase')
      updateStateSettings(userAccountSettings, data.value.user)
      // Object.assign(userAccountSettings, updatedData.user.accountSettings)
    } catch (error) {
      throw createError(`Error updating account settings: ${error}`)
    }
  }

  // function updatePassword(newPassword: SettingsPasswordType) {
  //   // !important: we will add password upate functionality later
  //   // TODO: Upate pinia store
  //   // TODO: Call API to update the password
  //   // TODO: Handle response and update passwordSettings
  // }

  return {
    userAccountSettings,
    userPasswordSettings,
    tabs: settingsTabs,
    user,
    getUserSettings,
    updateAccountSettings
    // updatePassword
  }
})
