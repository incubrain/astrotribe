<script setup lang="ts">
import { ref } from 'vue'

const { trackUserEngagement } = useAnalytics()

// Form data
const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref(null as string | null)

// Handle newsletter submission
const handleSubmit = async () => {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    submitError.value = 'Please enter a valid email address'
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    // In a real implementation, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Track successful signup
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'newsletter_subscription',
      source: 'footer',
    })

    // Handle success
    isSubmitting.value = false
    isSubmitted.value = true
    email.value = ''

    // Reset after a few seconds
    setTimeout(() => {
      isSubmitted.value = false
    }, 5000)
  } catch (error) {
    // Handle error
    isSubmitting.value = false
    submitError.value = 'Failed to subscribe. Please try again.'
    console.error('Newsletter subscription error:', error)
  }
}
</script>

<template>
  <div class="newsletter-signup-container">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 },
      }"
      class="space-y-6"
    >
      <h3 class="text-lg font-space text-white text-center">Stay updated with space discoveries</h3>
      <div class="relative max-w-md">
        <form @submit.prevent="handleSubmit">
          <div class="flex">
            <input
              v-model="email"
              type="email"
              placeholder="Your email address"
              class="w-full px-4 py-2 rounded-l-md bg-slate-900/70 border border-primary-600/30 text-white placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              :disabled="isSubmitting || isSubmitted"
            />
            <button
              type="submit"
              class="flex items-center justify-center px-4 py-2 rounded-r-md bg-primary-600 text-white font-medium hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-300 disabled:opacity-70"
              :disabled="isSubmitting || isSubmitted"
            >
              <span v-if="isSubmitting">
                <Icon
                  name="mdi:loading"
                  class="animate-spin"
                  size="20"
                />
              </span>
              <span v-else-if="isSubmitted">
                <Icon
                  name="mdi:check"
                  size="20"
                />
              </span>
              <span v-else>Subscribe</span>
            </button>
          </div>
        </form>

        <p class="text-sm pt-6 text-gray-400 text-center"> You can unsubscribe at any time. </p>

        <!-- Form feedback -->
        <div class="mt-2 h-5">
          <p
            v-if="submitError"
            class="text-sm text-red-400"
            >{{ submitError }}</p
          >
          <p
            v-else-if="isSubmitted"
            class="text-sm text-green-400"
            >Thanks for subscribing!</p
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.newsletter-signup-container {
  width: 100%;
}
</style>
