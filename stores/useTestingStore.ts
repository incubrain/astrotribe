import type { TestingSettingsType } from '@/types/testing'

export default defineStore('admin-settings', () => {
  const env = useRuntimeConfig().public
  const testingEnabled = readonly(ref(env.TEST_MODE === 'true'))
  const settings = reactive<TestingSettingsType>({
    authOn: true
    // Add other features as needed, update type in types\testing.ts
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
    settings[featureName] = !settings[featureName]
  }

  return {
    testingEnabled,
    settings,
    auth: authTests,
    toggleFeature
  }
})
