<script setup lang="ts">
// 1. Imports
import { ref, onMounted } from 'vue'

// 2. Component Options
defineOptions({
  name: 'MascotTopbar',
})

// 3. Reactive Variables
const isVisible = ref(true)

// 4. Component state
const message =
  "Hi, I'm Tara the Firefly—your quirky little mascot for saving the dark skies! Together, we can bring back the beauty of the night for everyone!"

// 5. Methods
const closeTopbar = () => {
  isVisible.value = false
  // Save dismissal time to localStorage
  const dismissalTime = new Date().getTime()
  localStorage.setItem('mascotTopbarDismissed', dismissalTime.toString())
}

const checkDismissalStatus = () => {
  const dismissalTimeStr = localStorage.getItem('mascotTopbarDismissed')
  if (!dismissalTimeStr) return

  const dismissalTime = parseInt(dismissalTimeStr)
  const currentTime = new Date().getTime()
  const oneMonth = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

  // If it's been more than a month since dismissal, show the topbar again
  if (currentTime - dismissalTime > oneMonth) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
}

// 6. Lifecycle Hooks
onMounted(() => {
  checkDismissalStatus()
})
</script>

<template>
  <div
    v-if="isVisible"
    class="sticky top-[60px] left-0 right-0 w-full bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-md border-b border-indigo-700/50 shadow-lg z-50 overflow-hidden py-2"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center justify-between">
        <!-- Mascot Avatar with enhanced size and glow -->
        <div class="flex items-center gap-4">
          <div class="overflow-visible min-w-20 min-h-20 relative z-[100]">
            <NuxtImg
              src="/images/mascot_tara.png"
              alt="Tara the Firefly Mascot"
              class="object-contain absolute min-w-[260px] min-h-[260px] -left-[130px] -top-[100px] z-[1000]"
            />
            <!-- Enhanced glow effect -->
            <div
              class="absolute glow-effect -inset-8 rounded-full"
              style="
                background: radial-gradient(
                  circle,
                  rgba(250, 204, 21, 0.5) 0%,
                  rgba(250, 204, 21, 0.1) 50%,
                  rgba(250, 204, 21, 0) 70%
                );
              "
            ></div>
          </div>

          <!-- Single line message -->
          <div class="pr-8 max-w-4xl">
            <p class="text-yellow-300 font-medium text-sm md:text-base truncate">
              {{ message }}
            </p>
          </div>
        </div>

        <!-- Call to Action and Close Button -->
        <div class="flex items-center gap-3 z-10">
          <NuxtLink
            to="/darksky"
            class="hidden sm:block"
          >
            <PrimeButton
              size="small"
              class="bg-yellow-600 hover:bg-yellow-500 text-white shadow-md"
            >
              <span>More Info</span>
            </PrimeButton>
          </NuxtLink>

          <!-- Close button -->
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-red-700 text-white transition-colors duration-200"
            title="Close banner"
            @click="closeTopbar"
          >
            <Icon
              name="mdi:close"
              size="18px"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced glow animation */
@keyframes glow {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.glow-effect {
  animation: glow 3s ease-in-out infinite;
}
</style>
