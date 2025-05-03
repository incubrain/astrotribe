<script setup lang="ts">
import { onMounted } from 'vue'

// Initialize popup using ad ID if no variant
const { isVisible, show, hide, handleClick, handleDismiss } = usePopup('workshop-ad')

let timeoutId: NodeJS.Timeout
onMounted(() => {
  timeoutId = setTimeout(() => {
    show()
  }, 3000)
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
        <slot />
      </div>
    </div>
  </Transition>
</template>
