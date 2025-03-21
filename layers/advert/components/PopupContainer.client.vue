<script setup lang="ts">
import { onMounted } from 'vue'

// Initialize popup using ad ID if no variant
const { isVisible, show, hide, handleClick, handleDismiss } = usePopup('frontiers-ad')

let timeoutId: NodeJS.Timeout
onMounted(() => {
  timeoutId = setTimeout(() => {
    show()
  }, 15000)
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        @click="handleDismiss"
      />

      <!-- Popup Content -->
      <div
        class="relative mt-0 bg-slate-900 rounded-lg shadow-xl border border-blue-500/20 max-w-sm w-full mx-4 transform transition-all"
      >
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
          @click="handleDismiss"
        >
          <Icon
            name="mdi:close"
            class="w-6 h-6"
          />
        </button>

        <!-- Content -->
        <div class="p-6">
          <!-- Ad Content -->
          <div class="space-y-4">
            <!-- Featured Image -->
            <div class="relative w-full aspect-mobile rounded-lg overflow-hidden bg-slate-800">
              <NuxtImg
                src="images/ads/frontiers-ad-v2.jpg"
                alt="Join the frontiers program"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- CTA Button -->
            <div class="mt-6">
              <a
                href="https://rzp.io/rzp/frontierprogram"
                target="_blank"
                rel="noopener noreferrer sponsored"
                class="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                @click="handleClick"
              >
                Claim Your Spot - ₹3,000/year
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
