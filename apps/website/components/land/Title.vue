<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
    default: '',
  },
  gradient: {
    type: Boolean,
    default: false,
  },
  centered: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: String,
    required: false,
    default: 'pb-12',
  },
})
</script>

<template>
  <div
    class="flex flex-col gap-4"
    :class="[padding, centered ? 'text-center' : 'text-left']"
  >
    <h2
      class="text-3xl md:text-5xl font-bold tracking-wider relative max-w-3xl mx-auto"
      :class="centered ? 'mx-auto' : 'mx-0'"
    >
      <!-- Main text with conditional gradient -->
      <span
        :class="
          gradient
            ? 'bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent'
            : 'text-white'
        "
      >
        {{ title }}
      </span>

      <!-- Glow effect behind text -->
      <span
        class="absolute inset-0 blur-sm bg-gradient-to-r from-white via-gray-100 to-gray-300 opacity-20 bg-clip-text text-transparent -z-10"
        aria-hidden="true"
      >
        {{ title }}
      </span>
    </h2>

    <h4
      v-if="subtitle"
      class="text-lg md:text-2xl font-light tracking-wide relative max-w-2xl"
      :class="centered ? 'mx-auto' : 'mx-0'"
    >
      <!-- Subtitle text -->
      <span class="text-primary-600">{{ subtitle }}</span>

      <!-- Subtitle glow effect -->
      <span
        class="absolute inset-0 blur-sm text-primary-600/30 -z-10"
        aria-hidden="true"
      >
        {{ subtitle }}
      </span>
    </h4>
  </div>
</template>

<style scoped>
h2 {
  text-wrap: normal !important;
  animation: textPulse 4s ease-in-out infinite;
}

h2:hover span:first-child {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

/* Text shadow animation */
@keyframes textPulse {
  0%,
  100% {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  }
  50% {
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
  }
}
</style>
