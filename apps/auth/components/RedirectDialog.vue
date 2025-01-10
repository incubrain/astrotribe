<!-- components/RedirectDialog.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalFn } from '@vueuse/core'
import { useRuntimeConfig, useCookie, navigateTo } from '#app'

const { appURL } = useRuntimeConfig().public
const { showRedirectModal } = storeToRefs(useAuthRedirectStore())

// We store user’s choice in a cookie:
const stayHere = useCookie<boolean>('stayHere', { default: () => false })

// Simple countdown state
const countdown = ref(3)
let stopInterval: (() => void) | undefined

// Watch for the modal becoming visible
watch(
  () => showRedirectModal.value,
  async (visible) => {
    if (!visible) {
      // Modal closed => stop any existing countdown
      stopInterval?.()
      return
    }

    // Modal is about to appear => reset countdown
    countdown.value = 3

    // Wait until DOM is updated so the modal actually renders
    await nextTick()

    // Start 1-second countdown
    const { pause } = useIntervalFn(() => {
      if (countdown.value <= 1) {
        // Auto-redirect if user never clicked
        goNow()
      } else {
        countdown.value--
      }
    }, 1000)

    stopInterval = pause
  },
)

function stay() {
  stayHere.value = true // user opts to stay => set the cookie
  showRedirectModal.value = false
}

function goNow() {
  navigateTo(appURL, { external: true })
}
</script>

<template>
  <div
    v-if="showRedirectModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/50" />

    <!-- Modal Box -->
    <div class="relative z-10 foreground p-6 rounded shadow-md w-[300px] text-center">
      <h3 class="text-xl font-bold mb-2">Redirect Notice</h3>
      <p class="mb-4">
        We detected a valid session on our main domain.
        <br />
        Redirecting in {{ countdown }}s...
      </p>
      <div class="flex justify-around gap-4">
        <button
          class="px-3 py-1 border rounded border-color bg-red-950"
          @click="stay"
        >
          Stay Here
        </button>
        <button
          class="px-3 py-1 border rounded border-color bg-primary-600 text-white"
          @click="goNow"
        >
          Go Now
        </button>
      </div>
    </div>
  </div>
</template>
