<script setup lang="ts">
interface Props {
  gradient?: 'blue' | 'purple' | 'mixed' | 'green' | 'orange'
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  glowColor?: string
  borderColor?: string
  rounded?: boolean
}

// Gradient configurations
const gradientConfigs = {
  blue: ['bg-sky-500', 'bg-blue-500', 'bg-sky-400'],
  purple: ['bg-purple-500', 'bg-indigo-500', 'bg-violet-500'],
  mixed: ['bg-sky-500', 'bg-purple-500', 'bg-blue-500'],
  green: ['bg-emerald-500', 'bg-green-500', 'bg-teal-500'],
  orange: ['bg-orange-500', 'bg-amber-500', 'bg-yellow-500'],
}

// Intensity configurations
const intensityConfigs = {
  low: {
    backdrop: 'backdrop-blur-sm',
    bgOpacity: 'bg-primary-950/30',
    blobOpacity: 'opacity-20',
    hoverBgOpacity: 'hover:bg-primary-950/40',
  },
  medium: {
    backdrop: 'backdrop-blur-md',
    bgOpacity: 'bg-primary-950/50',
    blobOpacity: 'opacity-30',
    hoverBgOpacity: 'hover:bg-primary-950/60',
  },
  high: {
    backdrop: 'backdrop-blur-lg',
    bgOpacity: 'bg-primary-950/70',
    blobOpacity: 'opacity-50',
    hoverBgOpacity: 'hover:bg-primary-950/80',
  },
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  gradient: 'blue',
  intensity: 'medium',
  interactive: false,
  glowColor: 'primary',
  borderColor: 'primary',
  rounded: true,
})

// Computed configurations
const gradientConfig = computed(() => gradientConfigs[props.gradient])
const intensityConfig = computed(() => intensityConfigs[props.intensity])

// Base classes
const baseClasses = computed(() => [
  'relative group w-full h-full z-10',
  intensityConfig.value.backdrop,
  intensityConfig.value.bgOpacity,
  'transition-all duration-300',
  props.rounded ? 'rounded-xl' : '',
  props.interactive ? 'hover:scale-[1.01] hover:shadow-md' : '',
  props.interactive ? intensityConfig.value.hoverBgOpacity : '',
])

// Border classes
const borderClasses = computed(() => ({
  [`border-${props.borderColor}-500/20`]: true,
  'border': true,
  'rounded-xl': props.rounded,
  [`group-hover:border-${props.borderColor}-500/40`]: props.interactive,
}))
</script>

<template>
  <div :class="baseClasses">
    <!-- Animated blobs for background effect -->
    <div
      class="absolute inset-0 transition-opacity duration-300"
      :class="[intensityConfig.blobOpacity, { 'group-hover:opacity-[0.1]': interactive }]"
    >
      <template
        v-for="(gradientClass, index) in gradientConfig"
        :key="index"
      >
        <div
          :class="[
            'absolute rounded-full mix-blend-screen filter blur-3xl',
            gradientClass,
            {
              'top-0 -left-20 w-40 h-40': index === 0,
              'top-0 -right-20 w-40 h-40': index === 1,
              '-bottom-20 left-10 w-40 h-40': index === 2,
            },
          ]"
        />
      </template>
    </div>

    <!-- Noise texture -->
    <div
      class="absolute inset-0 bg-noise pointer-events-none opacity-[0.02]"
      :class="{ 'group-hover:opacity-[0.03]': interactive }"
    />

    <!-- Border effect -->
    <div class="absolute inset-1 ring-primary-200 z-10">
      <div
        class="absolute inset-0 transition-colors duration-300"
        :class="borderClasses"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
