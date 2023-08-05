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
    icon: 'i-material-symbols-key'
  },
  {
    slot: 'application',
    label: 'Application',
    icon: 'i-material-symbols-apps',
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
    console.log('getUserSettings', id)
    // TODO: get user settings from database
    // TODO: store retrieved settings in pinia store
    // const { error, data } = await useFetch(`/api/users/settings/${id}`)
    // if (error) throw new Error(`error getting user settings: ${error.message}`)
    // if (data) {
    //   Object.assign(accountSettings, data?.accountSettings)
    //   passwordSettings.currentPassword = data.password
    //   // TODO: Create api endpoint, think about how we will fetch data based on DB schema
    // }
  }

  async function updateAccountSettings(newSettings: SettingsAccount) {
    console.log('settings:', newSettings)
    // TODO: Upate pinia store
    // TODO: Call API to update the password
    // TODO: Handle response and update accountSettings
  }

  async function updatePassword(newPassword: SettingsPassword) {
    console.log('password:', newPassword)
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
