<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Newsletter signup form
const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref(null)

const handleSubmit = async () => {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    submitError.value = 'Please enter a valid email address'
    return
  }

  isSubmitting.value = true
  submitError.value = null

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Handle success
  isSubmitting.value = false
  isSubmitted.value = true
  email.value = ''

  // Reset after a few seconds
  setTimeout(() => {
    isSubmitted.value = false
  }, 5000)
}

onMounted(() => {
  if (import.meta.client) {
    // Animate CTA section
    gsap.from('.cta-content', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="cta-section py-16 md:py-24 relative overflow-hidden">
    <!-- Background elements -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 z-0"
    ></div>
    <div
      class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
    ></div>
    <div
      class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
    ></div>

    <!-- Animated particles (stars) -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div
        class="absolute h-2 w-2 rounded-full bg-white opacity-70 animate-pulse"
        style="top: 10%; left: 5%"
      ></div>
      <div
        class="absolute h-1 w-1 rounded-full bg-white opacity-50 animate-pulse"
        style="top: 20%; left: 15%; animation-delay: 1s"
      ></div>
      <div
        class="absolute h-1.5 w-1.5 rounded-full bg-white opacity-60 animate-pulse"
        style="top: 15%; right: 15%; animation-delay: 0.5s"
      ></div>
      <div
        class="absolute h-1 w-1 rounded-full bg-white opacity-50 animate-pulse"
        style="top: 35%; right: 5%; animation-delay: 1.5s"
      ></div>
      <div
        class="absolute h-2 w-2 rounded-full bg-white opacity-70 animate-pulse"
        style="bottom: 20%; left: 25%; animation-delay: 0.7s"
      ></div>
      <div
        class="absolute h-1.5 w-1.5 rounded-full bg-white opacity-60 animate-pulse"
        style="bottom: 15%; right: 20%; animation-delay: 1.2s"
      ></div>
    </div>

    <!-- Main content -->
    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="cta-content text-center max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Explore the Cosmos?</h2>
        <p class="text-xl text-gray-300 mb-10">
          Join thousands of researchers, educators, and astronomy enthusiasts using AstroQuery to
          unlock the secrets of the universe.
        </p>

        <!-- CTA buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <PrimeButton
            size="large"
            class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300 text-lg px-8"
          >
            Start Free Trial
            <Icon
              name="mdi:rocket-launch"
              class="ml-2"
              size="20"
            />
          </PrimeButton>
          <PrimeButton
            size="large"
            outlined
            class="border-white text-white hover:bg-white/10 transition-all duration-300 text-lg px-8"
          >
            Watch Demo
            <Icon
              name="mdi:play-circle"
              class="ml-2"
              size="20"
            />
          </PrimeButton>
        </div>

        <!-- Newsletter signup -->
        <div class="max-w-md mx-auto">
          <h3 class="text-lg font-medium text-white mb-4">Stay updated with space discoveries</h3>
          <div class="relative">
            <form @submit.prevent="handleSubmit">
              <div class="flex">
                <input
                  v-model="email"
                  type="email"
                  placeholder="Your email address"
                  class="w-full px-4 py-3 rounded-l-md bg-slate-900/70 border border-primary-600/30 text-white placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  :disabled="isSubmitting || isSubmitted"
                />
                <button
                  type="submit"
                  class="flex items-center justify-center px-6 py-3 rounded-r-md bg-primary-600 text-white font-medium hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-300 disabled:opacity-70"
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
          <p class="mt-3 text-xs text-gray-400">
            By subscribing, you agree to receive astronomy updates. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
