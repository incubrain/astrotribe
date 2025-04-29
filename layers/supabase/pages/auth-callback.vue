<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSupabaseClient } from '#imports'

const logger = useLogger('auth-callback')
const env = useRuntimeConfig().public
const supabase = useSupabaseClient()

const isLoading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const redirectTarget = ref(env.appURL)
const progressWidth = ref(0)

// Function to redirect to login
function redirectToLogin() {
  window.location.href = `${env.authURL}/login`
}

// Get redirect URL from query params
const route = useRoute()
if (route.query.redirect_to) {
  redirectTarget.value = decodeURIComponent(route.query.redirect_to as string)
}

// Progress animation
let progressInterval: any = null

onMounted(async () => {
  try {
    // Check for error in URL
    if (route.query.error) {
      throw new Error(route.query.error_description?.toString() || 'Authentication failed')
    }

    // Process auth callback
    const { data, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (!data.session) {
      throw new Error('Failed to establish session')
    }

    // Session established successfully
    isLoading.value = false
    logger.info('Auth successful, checking onboarding status')

    // Start progress animation
    progressInterval = setInterval(() => {
      progressWidth.value += 4
      if (progressWidth.value >= 100) {
        clearInterval(progressInterval)

        // Check if user needs onboarding
        checkOnboardingStatus(data.session.user.id)
      }
    }, 50)
  } catch (err: any) {
    logger.error('Auth callback error', err)
    isLoading.value = false
    error.value = true
    errorMessage.value = err.message || 'Failed to authenticate'
  }
})

// Clean up on unmount
onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// Check if user needs onboarding
async function checkOnboardingStatus(userId: string) {
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single<{ onboarding_completed: boolean }>()

    // Determine redirect target
    let finalRedirectUrl = redirectTarget.value

    // Override with onboarding if needed
    if (profile && profile.onboarding_completed === false) {
      finalRedirectUrl = `${env.appURL}/onboarding`
    }

    // Redirect user
    window.location.href = finalRedirectUrl as string
  } catch (err) {
    // If profile check fails, redirect to app URL anyway
    logger.error('Error checking onboarding status', err)
    window.location.href = redirectTarget.value as string
  }
}
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center bg-gray-900">
    <div
      class="max-w-md w-full p-6 rounded-lg border border-gray-800 bg-gray-900/80 flex flex-col items-center"
    >
      <div
        v-if="isLoading"
        class="text-center"
      >
        <Icon
          name="mdi:loading"
          class="animate-spin text-primary-500 mb-4"
          size="50px"
        />
        <h2 class="text-xl font-bold text-white mb-2">Authenticating</h2>
        <p class="text-gray-400">Verifying your credentials...</p>
      </div>

      <div
        v-else-if="error"
        class="text-center"
      >
        <Icon
          name="mdi:alert-circle-outline"
          class="text-red-500 mb-4"
          size="50px"
        />
        <h2 class="text-xl font-bold text-white mb-2">Authentication Error</h2>
        <p class="text-red-400 mb-4">{{ errorMessage }}</p>
        <PrimeButton
          label="Return to Login"
          class="w-full"
          @click="redirectToLogin"
        />
      </div>

      <div
        v-else
        class="text-center"
      >
        <Icon
          name="mdi:check-circle"
          class="text-green-500 mb-4"
          size="50px"
        />
        <h2 class="text-xl font-bold text-white mb-2">Success!</h2>
        <p class="text-gray-400 mb-2">Authentication complete. Redirecting...</p>
        <div class="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div
            class="bg-primary-500 h-2 rounded-full"
            :style="{ width: `${progressWidth}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
