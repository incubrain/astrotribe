<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Define props for the InfiniteScroll component
const props = defineProps({
  // Items to display in the infinite scroll
  items: {
    type: Array,
    required: true,
  },
  // Direction of the scroll - 'normal' or 'reverse'
  direction: {
    type: String,
    default: 'normal',
    validator: (val: string) => ['normal', 'reverse'].includes(val),
  },
  // Animation duration in seconds
  duration: {
    type: Number,
    default: 60,
  },
  // Whether to include name labels below logos
  showLabels: {
    type: Boolean,
    default: false,
  },
  // Container class
  containerClass: {
    type: String,
    default: '',
  },
})

// Generate a unique ID for this instance
const uniqueId = ref(`scroll-${Math.random().toString(36).substr(2, 9)}`)

// Number of items after filtering out duplicates (for animation calculation)
const uniqueItemCount = computed(() => {
  const uniqueIds = new Set(props.items.map((item) => item.id))
  return uniqueIds.size
})

// Compute the styles directly in the template instead of using v-bind in <style>
const slideStyle = computed(() => ({
  display: 'flex',
  animation: `${uniqueId.value} ${props.duration}s linear infinite`,
  animationDirection: props.direction === 'reverse' ? 'reverse' : 'normal',
  whiteSpace: 'nowrap',
  width: 'max-content',
}))

const logoItemStyle = computed(() => ({
  width: '120px',
  height: props.showLabels ? '120px' : '80px',
  margin: '0 12px',
  flexShrink: 0,
}))

const logoItemStyleMobile = computed(() => ({
  width: '100px',
  height: props.showLabels ? '100px' : '70px',
  margin: '0 8px',
  flexShrink: 0,
}))

// Add the keyframes using JavaScript after mount
onMounted(() => {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = `
    @keyframes ${uniqueId.value} {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-120px * ${uniqueItemCount.value}));
      }
    }
    
    @media (max-width: 768px) {
      @keyframes ${uniqueId.value} {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(calc(-100px * ${uniqueItemCount.value}));
        }
      }
    }
  `
  document.head.appendChild(styleEl)
})
</script>

<template>
  <div :class="`logos-track ${containerClass}`">
    <div
      class="logos-slide"
      :style="slideStyle"
    >
      <div
        v-for="item in items"
        :key="item.key || item.id"
        class="logo-item"
        :style="$isMobile ? logoItemStyleMobile : logoItemStyle"
      >
        <div class="partner-logo">
          <img
            :src="item.logo"
            :alt="item.name"
            class="logo-image"
          />
        </div>
        <div
          v-if="showLabels"
          class="mt-2 text-center text-xs text-gray-400"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Marquee animation base styles */
.logos-track {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 10px 0;
}

.logos-track:hover .logos-slide {
  animation-play-state: paused;
}

.partner-logo {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(30, 41, 59, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.3s;
}

.partner-logo:hover {
  border-color: rgba(30, 64, 175, 0.5);
}

.logo-image {
  max-height: 3rem;
  max-width: 100%;
  opacity: 0.7;
  transition: opacity 0.3s;
  filter: invert(1);
}

.logo-image:hover {
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .partner-logo {
    height: 70px;
  }
}
</style>
