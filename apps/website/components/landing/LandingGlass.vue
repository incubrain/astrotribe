<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padded?: boolean
  gradient?: 'blue' | 'purple' | 'mixed' | 'green' | 'orange'
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean // Enable hover effects
  glowColor?: string // Custom glow color
  borderColor?: string // Custom border color
  hoverEffect?: 'glow' | 'scale' | 'blur' | 'none'
  isolateContent?: boolean // Prevents hover effects from affecting slot content
  rounded: boolean
  overflow: boolean
}

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

const gradientConfig = computed(() => {
  const configs = {
    blue: ['bg-sky-500', 'bg-blue-500', 'bg-sky-400'],
    purple: ['bg-purple-500', 'bg-indigo-500', 'bg-violet-500'],
    mixed: ['bg-sky-500', 'bg-purple-500', 'bg-blue-500'],
    green: ['bg-emerald-500', 'bg-green-500', 'bg-teal-500'],
    orange: ['bg-orange-500', 'bg-amber-500', 'bg-yellow-500'],
  }
  return configs[props.gradient]
})

const intensityConfig = computed(() => {
  const configs = {
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
  }
  return configs[props.intensity]
})

const hoverClasses = computed(() => {
  if (!props.interactive) return ''

  const effects = {
    glow: `hover:shadow-[0_0_30px_rgba(var(--color-${props.glowColor}-500),0.3)]`,
    scale: 'hover:scale-[1.02]',
    blur: 'hover:backdrop-blur-2xl',
    none: '',
  }

  return `transition-all duration-500 ${effects[props.hoverEffect]} ${intensityConfig.value.hoverBgOpacity}`
})

const borderClasses = computed(
  () => `border-${props.borderColor}-500/${props.intensity === 'low' ? '20' : '30'}`,
)
</script>

<template>
  <div
    class="relative group"
    :class="[
      intensityConfig.backdrop,
      intensityConfig.bgOpacity,
      hoverClasses,
      'transition-all duration-500',
      !rounded ? 'rounded-none' : 'rounded-2xl',
      !overflow ? 'overflow-hidden' : '',
    ]"
  >
    <!-- Animated gradient mesh -->
    <div
      class="absolute inset-0 transition-opacity duration-500"
      :class="[intensityConfig.blobOpacity, { 'group-hover:opacity-[0.15]': interactive }]"
    >
      <div
        :class="[
          'absolute top-0 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob',
          gradientConfig[0],
        ]"
      />
      <div
        :class="[
          'absolute top-0 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000',
          gradientConfig[1],
        ]"
      />
      <div
        :class="[
          'absolute -bottom-32 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000',
          gradientConfig[2],
        ]"
      />
    </div>

    <!-- Noise texture -->
    <div
      class="absolute inset-0 bg-noise pointer-events-none transition-opacity duration-500"
      :class="[interactive ? 'opacity-[0.02] group-hover:opacity-[0.03]' : 'opacity-[0.02]']"
    />

    <!-- Electric edges -->
    <div class="absolute inset-1">
      <div
        class="absolute inset-0 border transition-colors duration-500"
        :class="[
          borderClasses,
          {
            [`group-hover:border-${props.borderColor}-500/50`]: interactive,
            ['rounded-2xl']: rounded,
          },
        ]"
      />
      <div
        class="absolute inset-0 animate-glow"
        :class="[
          {
            ['rounded-2xl']: rounded,
          },
        ]"
        :style="{
          '--glow-color': `var(--color-${props.glowColor}-500)`,
        }"
      />
    </div>

    <!-- Content -->
    <slot name="header" />

    <div
      class="relative z-10"
      :class="[{ 'p-12': padded }, { 'isolation-auto': isolateContent }]"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.isolation-auto {
  isolation: auto;
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgba(var(--glow-color), 0.1),
      0 0 8px rgba(var(--glow-color), 0.1),
      inset 0 0 4px rgba(var(--glow-color), 0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(var(--glow-color), 0.2),
      0 0 16px rgba(var(--glow-color), 0.2),
      inset 0 0 8px rgba(var(--glow-color), 0.2);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.1),
      0 0 8px rgba(74, 222, 255, 0.1),
      inset 0 0 4px rgba(74, 222, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.2),
      0 0 16px rgba(74, 222, 255, 0.2),
      inset 0 0 8px rgba(74, 222, 255, 0.2);
  }
}

@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
/* Rest of the animations remain the same */
</style>
