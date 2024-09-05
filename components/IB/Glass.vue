<template>
  <div
    :id="uniqueId"
    class="relative"
  >
    <div
      ref="gravityAreaRef"
      class="pointer-events-none absolute -inset-[30%] z-0"
    ></div>
    <div
      ref="cardRef"
      :class="[
        'glass-card relative overflow-hidden rounded-md shadow-xl',
        'ring-2 ring-inset ring-white/10',
        `backdrop-blur-${blurIntensity}`,
        `p-${padding}`,
        bgClasses,
        borderClasses,
        textClasses,
        ...hoverClasses,
      ]"
      :style="cardStyle"
      role="region"
      :aria-label="ariaLabel"
      @mousemove="(e) => handleMouseMove(e)"
      @mouseleave="handleMouseLeave"
    >
      <div class="glass-card-content relative z-20">
        <slot name="header"></slot>
        <slot></slot>
      </div>
      <div
        :class="['absolute inset-0 z-10 h-full w-full bg-gradient-to-br', gradientClasses]"
      ></div>
      <div
        class="glass-effect"
        :style="spotlightStyle"
      ></div>
      <div
        v-if="loading"
        class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const uniqueId = useId()

const tailwindColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'primary', // Assuming you have a custom 'primary' color
] as const

type TailwindColor = (typeof tailwindColors)[number]

const props = defineProps({
  color: { type: String as PropType<TailwindColor>, default: 'primary' },
  bgOpacity: { type: Number, default: 20 },
  gradientOpacity: { type: Number, default: 10 },
  blurIntensity: { type: String, default: 'md' },
  disableHover: { type: Boolean, default: false },
  padding: { type: String, default: '6' },
  loading: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Glass card' },
})

const cardRef = ref<HTMLElement | null>(null)
const gravityAreaRef = ref<HTMLElement | null>(null)

const {
  handleMouseMove,
  handleMouseLeave,
  cardStyle,
  spotlightStyle,
  bgClasses,
  borderClasses,
  textClasses,
  gradientClasses,
  hoverClasses,
} = useGlassCard(props, uniqueId)
</script>

<style scoped>
.glass-card {
  transition: all 0.3s ease;
}

.glass-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.glass-card-content {
  transition: transform 0.3s ease;
}

.glass-card:hover .glass-card-content {
  transform: translateY(-5px);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.spotlight {
  backdrop-filter: blur(2px) contrast(1.2);
  mix-blend-mode: overlay;
}

/* .card-content {
  transform: translateZ(20px);
  transition: all 0.3s ease;
}
.card:hover .card-content {
  box-shadow: calc((var(--x) / var(--card-width) - 0.5) * 20px)
    calc((var(--y) / var(--card-height) - 0.5) * 20px) 10px rgba(0, 0, 0, 0.1);
} */
</style>
