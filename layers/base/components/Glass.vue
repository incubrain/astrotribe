<script setup lang="ts">
interface Props {
  intensity?: 'minimal' | 'low' | 'medium' | 'high'
  gradient?: 'blue' | 'purple' | 'mixed' | 'green' | 'orange'
  glowColor?: string
  interactive?: boolean
  hoverEffect?: string
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'low',
  gradient: 'blue',
  glowColor: 'primary',
  interactive: false,
  hoverEffect: '',
  padding: true,
})

// Intensity configurations
const intensityConfig = {
  minimal: {
    backdrop: 'backdrop-blur-sm',
    bgOpacity: 'bg-primary-950/20',
    blobOpacity: 'opacity-[0.02]',
    hoverBgOpacity: 'hover:bg-primary-950/30',
  },
  low: {
    backdrop: 'backdrop-blur-sm',
    bgOpacity: 'bg-primary-950/30',
    blobOpacity: 'opacity-[0.03]',
    hoverBgOpacity: 'hover:bg-primary-950/40',
  },
  medium: {
    backdrop: 'backdrop-blur-md',
    bgOpacity: 'bg-primary-950/50',
    blobOpacity: 'opacity-[0.04]',
    hoverBgOpacity: 'hover:bg-primary-950/60',
  },
  high: {
    backdrop: 'backdrop-blur-lg',
    bgOpacity: 'bg-primary-950/70',
    blobOpacity: 'opacity-[0.05]',
    hoverBgOpacity: 'hover:bg-primary-950/80',
  },
}

// Gradient configurations
const gradientConfig = {
  blue: ['bg-sky-500', 'bg-blue-500', 'bg-sky-400'],
  purple: ['bg-purple-500', 'bg-indigo-500', 'bg-violet-500'],
  mixed: ['bg-sky-500', 'bg-purple-500', 'bg-blue-500'],
  green: ['bg-emerald-500', 'bg-green-500', 'bg-teal-500'],
  orange: ['bg-orange-500', 'bg-amber-500', 'bg-yellow-500'],
}

// Get the appropriate configuration
const currentIntensity = intensityConfig[props.intensity]
const currentGradient = gradientConfig[props.gradient]
</script>

<template>
  <div
    class="relative overflow-hidden transition-all duration-300 h-full"
    :class="[
      currentIntensity.backdrop,
      currentIntensity.bgOpacity,
      props.interactive ? currentIntensity.hoverBgOpacity : '',
      props.interactive ? 'hover:scale-[1.01] hover:shadow-md' : '',
      props.padding ? 'p-6' : '',
      'rounded-xl border border-primary-500/20',
      props.interactive ? 'group-hover:border-primary-500/40' : '',
    ]"
  >
    <!-- Animated blobs for background effect -->
    <div
      class="absolute inset-0 transition-opacity duration-300"
      :class="[currentIntensity.blobOpacity, { 'group-hover:opacity-[0.1]': props.interactive }]"
    >
      <template
        v-for="(gradientClass, index) in currentGradient"
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
      :class="{ 'group-hover:opacity-[0.03]': props.interactive }"
    />

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
