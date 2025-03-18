<script setup lang="ts">
interface Props {
  padded?: boolean
  gradient?: keyof typeof gradientConfigs
  intensity?: keyof typeof intensityConfigs
  interactive?: boolean
  glowColor?: string
  borderColor?: string
  hoverEffect?: keyof typeof hoverEffects
  isolateContent?: boolean
  rounded?: boolean
  overflow?: boolean
}

// Move configurations outside component for better reuse and performance
const gradientConfigs = {
  blue: ['bg-sky-500', 'bg-blue-500', 'bg-sky-400'],
  purple: ['bg-purple-500', 'bg-indigo-500', 'bg-violet-500'],
  mixed: ['bg-sky-500', 'bg-purple-500', 'bg-blue-500'],
  green: ['bg-emerald-500', 'bg-green-500', 'bg-teal-500'],
  orange: ['bg-orange-500', 'bg-amber-500', 'bg-yellow-500'],
} as const

const intensityConfigs = {
  low: {
    backdrop: 'backdrop-blur-lg',
    bgOpacity: 'bg-primary-950/30',
    blobOpacity: 'opacity-5',
    hoverBgOpacity: 'hover:bg-primary-950/40',
  },
  medium: {
    backdrop: 'backdrop-blur-xl',
    bgOpacity: 'bg-primary-950/50',
    blobOpacity: 'opacity-10',
    hoverBgOpacity: 'hover:bg-primary-950/60',
  },
  high: {
    backdrop: 'backdrop-blur-2xl',
    bgOpacity: 'bg-primary-950/70',
    blobOpacity: 'opacity-15',
    hoverBgOpacity: 'hover:bg-primary-950/80',
  },
} as const

const hoverEffects = {
  glow: (color: string) => `hover:shadow-[0_0_30px_rgba(var(--color-${color}-500),0.3)]`,
  scale: 'hover:scale-[1.02]',
  blur: 'hover:backdrop-blur-2xl',
  none: '',
} as const

// Default props with better typing
const props = withDefaults(defineProps<Props>(), {
  padded: true,
  gradient: 'blue',
  intensity: 'medium',
  interactive: false,
  glowColor: 'sky',
  borderColor: 'sky',
  hoverEffect: 'none',
  isolateContent: true,
  rounded: true,
  overflow: false,
})

// Memoize complex computations
const gradientConfig = computed(() => gradientConfigs[props.gradient])
const intensityConfig = computed(() => intensityConfigs[props.intensity])

const baseClasses = computed(() => [
  'relative group w-full',
  intensityConfig.value.backdrop,
  intensityConfig.value.bgOpacity,
  'transition-all duration-500',
  props.rounded ? 'rounded-2xl' : 'rounded-none',
  props.overflow ? '' : 'overflow-hidden',
])

const hoverClasses = computed(() => {
  if (!props.interactive) return ''

  const effect =
    typeof hoverEffects[props.hoverEffect] === 'function'
      ? hoverEffects[props.hoverEffect](props.glowColor)
      : hoverEffects[props.hoverEffect]

  return `transition-all duration-500 ${effect} ${intensityConfig.value.hoverBgOpacity}`
})

const borderClasses = computed(() => ({
  ['border-' + props.borderColor + '-500/' + (props.intensity === 'low' ? '20' : '30')]: true,
  'rounded-2xl': props.rounded,
  [`group-hover:border-${props.borderColor}-500/50`]: props.interactive,
}))

const contentClasses = computed(() => ({
  'p-12': props.padded,
  'isolation-auto': props.isolateContent,
}))
</script>

<template>
  <div :class="[baseClasses, hoverClasses]">
    <div
      class="absolute inset-0 transition-opacity duration-500"
      :class="[intensityConfig.blobOpacity, { 'group-hover:opacity-[0.15]': interactive }]"
    >
      <template
        v-for="(gradientClass, index) in gradientConfig"
        :key="index"
      >
        <div
          :class="[
            'absolute rounded-full mix-blend-multiply filter blur-3xl',
            gradientClass,
            {
              'top-0 -left-40 w-96 h-96': index === 0,
              'top-0 -right-40 w-96 h-96 animation-delay-2000': index === 1,
              '-bottom-32 left-20 w-96 h-96 animation-delay-4000': index === 2,
            },
          ]"
        />
      </template>
    </div>

    <!-- Noise texture -->
    <div
      class="absolute inset-0 bg-noise pointer-events-none transition-opacity duration-500"
      :class="{
        'opacity-[0.02] group-hover:opacity-[0.03]': interactive,
        'opacity-[0.02]': !interactive,
      }"
    />

    <!-- Electric edges -->
    <div class="absolute inset-1">
      <div
        class="absolute inset-0 border transition-colors duration-500"
        :class="borderClasses"
      />
      <div
        class="absolute inset-0"
        :class="{ 'rounded-2xl': rounded }"
        :style="{
          '--glow-color': `var(--color-${glowColor}-500)`,
        }"
      />
    </div>

    <!-- Content -->
    <slot name="header" />
    <div
      class="relative z-10 min-h-full"
      :class="contentClasses"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
