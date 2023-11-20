import type { TestingSettingsType } from '@/types/testing'

export default defineStore('admin-settings', () => {
  const env = useRuntimeConfig().public
  const settings = ref<TestingSettingsType>({
    authOn: true
  })

  // TODO: add all functions I want to test here
  const auth = useAuth()
  const user = { email: env.TESTING_USERNAME, password: env.TESTING_PASSWORD }
  const authTests = {
    login: async () => {
      try {
        const result = await auth.login(user)
      } catch (error) {
        console.error('(test) Login Error:', error)
        throw error
      }
    },
    register: async () => await auth.register(user)
  }

  function toggleFeature(featureName: keyof TestingSettingsType) {
    settings.value[featureName] = !settings.value[featureName]
  }

  return {
    settings,
    auth: authTests,
    toggleFeature
  }
})
