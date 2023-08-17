import { TestingSettingsType } from '@/types/testing'

export default defineStore('admin-settings', () => {
  const env = useRuntimeConfig().public
  const testingEnabled = readonly(ref(env.TEST_MODE === 'true'))
  const settings = reactive<TestingSettingsType>({
    authOn: false,
    smtpOn: true
    // Add other features as needed, update type in types\testing.ts
  })

  // TODO: add all functions I want to test here
  const authStore = useAuthStore()
  const user = { email: env.TESTING_USERNAME, password: env.TESTING_PASSWORD }
  const auth = {
    login: async () => {
      try {
        const result = await authStore.login(user)
        console.log('Login Successful:', result)
      } catch (error) {
        console.error('(test) Login Error:', error)
        throw error
      }
    },
    register: async () => await authStore.register(user),
    componentVisible: () => !settings.authOn || authStore.hasSession
  }

  function toggleFeature(featureName: keyof TestingSettingsType) {
    settings[featureName] = !settings[featureName]
  }

  return {
    testingEnabled,
    settings,
    auth,
    toggleFeature
  }
})
