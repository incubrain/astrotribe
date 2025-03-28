<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  showScrollButtons: {
    type: Boolean,
    default: true,
  },
  scrollAmount: {
    type: Number,
    default: 300,
  },
  scrollBehavior: {
    type: String as () => 'smooth' | 'auto',
    default: 'smooth',
  },
})

const containerRef = ref<HTMLElement | null>(null)
const showLeftButton = ref(false)
const showRightButton = ref(false)

const checkScrollButtons = () => {
  if (!containerRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = containerRef.value
  showLeftButton.value = scrollLeft > 0
  showRightButton.value = scrollLeft < scrollWidth - clientWidth - 10 // 10px buffer for rounding errors
}

const scrollLeft = () => {
  if (!containerRef.value) return
  containerRef.value.scrollBy({
    left: -props.scrollAmount,
    behavior: props.scrollBehavior,
  })
}

const scrollRight = () => {
  if (!containerRef.value) return
  containerRef.value.scrollBy({
    left: props.scrollAmount,
    behavior: props.scrollBehavior,
  })
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', checkScrollButtons)
    checkScrollButtons()

    // Check after images load (which can affect scroll width)
    window.addEventListener('load', checkScrollButtons)
    window.addEventListener('resize', checkScrollButtons)

    // Initial check after a short delay to allow for content rendering
    setTimeout(checkScrollButtons, 100)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', checkScrollButtons)
  }
  window.removeEventListener('load', checkScrollButtons)
  window.removeEventListener('resize', checkScrollButtons)
})
</script>

<template>
  <div class="relative group">
    <!-- Scroll content -->
    <div
      ref="containerRef"
      class="overflow-x-auto hide-scrollbar py-2"
    >
      <slot></slot>
    </div>

    <!-- Scroll buttons -->
    <button
      v-if="props.showScrollButtons && showLeftButton"
      class="scroll-button left-0 -translate-x-1/2 bg-primary-800/80 opacity-0 group-hover:opacity-100"
      @click="scrollLeft"
    >
      <Icon
        name="mdi:chevron-left"
        class="w-5 h-5"
      />
    </button>

    <button
      v-if="props.showScrollButtons && showRightButton"
      class="scroll-button right-0 translate-x-1/2 bg-primary-800/80 opacity-0 group-hover:opacity-100"
      @click="scrollRight"
    >
      <Icon
        name="mdi:chevron-right"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-button:hover {
  background-color: rgba(var(--primary-600-rgb), 0.9);
}
</style>
