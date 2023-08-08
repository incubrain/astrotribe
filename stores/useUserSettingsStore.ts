import { SettingsAccount, SettingsPassword } from '@/types/zod/settings'

const settingsTabs = [
  {
    slot: 'account',
    label: 'Account',
    icon: 'i-material-symbols-home'
  },
  {
    slot: 'password',
    label: 'Password',
    icon: 'i-material-symbols-key',
    disabled: true
  },
  {
    slot: 'application',
    label: 'Application',
    icon: 'i-material-symbols-laptop-mac-outline',
    disabled: true
  },
  {
    slot: 'notifications',
    label: 'Notifications',
    icon: 'i-material-symbols-notifications',
    disabled: true
  }
]

export const useUserSettingsStore = defineStore('userSettings', () => {
  // info: use reactive() to make the object reactive, ref is for primitive types
  // TypeScript supports 7 primitive types number, string, boolean, bigint, symbol, undefined, and null.
  const userAccountSettings = reactive({
    given_name: 'your given name',
    surname: 'your surname',
    email: 'your email',
    introduction: 'your introduction',
    quote: 'your quote'
  })
  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password'
  })
  // TODO: Add more settings as needed
  // const preferenceSettings = reactive({ theme: 'light', language: 'en' })
  // const notificationSettings = reactive({ email: true, push: false })

  async function getUserSettings(id: number) {
    try {
      console.log('getUserSettings', id)
      // TODO: get user settings from database
      const response = await fetch(`/api/users/settings/${id}`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error(`Error fetching user settings. Status: ${response.status}`)
      }
      const data = await response.json()
      // TODO: store retrieved settings in pinia store
      Object.assign(userAccountSettings, data.accountSettings)
      console.log('data:', data)
      // Password is not returned from the API
      // userPasswordSettings.currentPassword = data.password
    } catch (error) {
      console.error('Error fetching user settings:', error)
    }
  }

  async function updateAccountSettings(newSettings: SettingsAccount) {
    const id = 34
    console.log('settings:', newSettings)
    try {
      // Calling the API to update the account settings
      const response = await fetch(`/api/users/settings/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          settingsType: 'account',
          data: newSettings
        })
      })
      if (!response.ok) {
        throw new Error(`Error updating account settings. Status: ${response.status}`)
      }
      const updatedData = await response.json()
      // Updating the Pinia store with the new settings received from the API
      Object.assign(userAccountSettings, updatedData.user.accountSettings)
      console.log('Updated account settings:', updatedData.user)
    } catch (error) {
      console.error('Error updating account settings:', error)
    }
  }

  async function updatePassword(newPassword: SettingsPassword) {
    console.log('password:', newPassword)
    // !important: we will add password upate functionality later
    // TODO: Upate pinia store
    // TODO: Call API to update the password
    // TODO: Handle response and update passwordSettings
  }

  return {
    userAccountSettings,
    userPasswordSettings,
    tabs: settingsTabs,
    getUserSettings,
    updateAccountSettings,
    updatePassword
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSettingsStore, import.meta.hot))
}
