type SettingsKey = 'usersStore' | 'storeNews'

export const useSettingsStore = defineStore('settingsStore', () => {
  const settings = ref({} as Settings)
  const summaryLevel = ref('beginner' as SummaryLevel)

  function toggleSettings(key: SettingsKey) {
    settings.value[key] = !settings.value[key]
  }

  function isSettingsOn(key: SettingsKey) {
    return !settings.value[key]
  }

  const changeSummaryLevel = (level: 'beginner' | 'intermediate' | 'expert') => {
    summaryLevel.value = level
  }

  return {
    toggleSettings,
    isSettingsOn,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
