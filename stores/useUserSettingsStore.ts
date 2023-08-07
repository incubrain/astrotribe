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
    // TODO: get user settings from database
    // TODO: store retrieved settings in pinia store
    // TODO: think of errors you need to handle, use try catch block
    // const { error, data } = await useFetch(`/api/users/settings/${id}`)
    // if (error) throw new Error(`error getting user settings: ${error.message}`)
    // if (data) {
    //   Object.assign(accountSettings, data?.accountSettings)
    //   passwordSettings.currentPassword = data.password
    // }
    try {
      console.log('getUserSettings', id)
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) {
        throw new Error(`Error fetching user settings. Status: ${response.status}`)
      }
      const data = await response.json()
      Object.assign(userAccountSettings, data.accountSettings)
      console.log('data:', data)
      // userPasswordSettings.currentPassword = data.password
    } catch (error) {
      console.error('Error fetching user settings:', error.message)
    }
  }

  async function updateAccountSettings(newSettings: SettingsAccount) {
    console.log('settings:', newSettings)
    // TODO: Upate pinia store
    // TODO: Call API to update the password
    // TODO: Handle response and update accountSettings
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
