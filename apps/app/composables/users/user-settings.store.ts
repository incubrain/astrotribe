type SettingsKey = 'usersStore' | 'storeNews'

export const useUserSettingsStore = defineStore('settingsStore', () => {
  const settings = ref({} as Settings)

  function toggleSettings(key: SettingsKey) {
    settings.value[key] = !settings.value[key]
  }

  function isSettingsOn(key: SettingsKey) {
    return !settings.value[key]
  }

  return {
    settings,
    toggleSettings,
    isSettingsOn,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSettingsStore, import.meta.hot))
}
