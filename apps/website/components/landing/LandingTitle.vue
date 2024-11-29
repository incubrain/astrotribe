<template>
  <div
    class="flex flex-col text-center gap-4"
    :class="padding"
  >
    <h2
      class="text-3xl md:text-5xl font-bold tracking-wider relative font-orbitron max-w-3xl text-wrap mx-auto"
    >
      <!-- Main text - Make this solid white initially -->
      <span class="relative text-white">{{ title }}</span>

      <!-- Glow effect - Position behind the main text -->
      <span
        class="absolute inset-0 blur-sm bg-gradient-to-r from-white via-gray-100 to-gray-300 opacity-50 bg-clip-text text-transparent -z-10"
        aria-hidden="true"
      >
        {{ title }}
      </span>
    </h2>

    <h4
      v-if="subtitle"
      class="text-lg md:text-2xl font-light tracking-wide font-sourcecodepro relative max-w-xl mx-auto"
    >
      <!-- Main subtitle text - Solid color -->
      <span class="relative text-sky-400">{{ subtitle }}</span>

      <!-- Subtitle glow - Behind main text -->
      <span
        class="absolute inset-0 blur-sm text-sky-400/30 -z-10"
        aria-hidden="true"
      >
        {{ subtitle }}
      </span>
    </h4>
  </div>
</template>

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
  padding: {
    type: String,
    required: false,
    default: 'pb-8',
  },
})
</script>

<style scoped>
/* Optional: Add hover effect */

h2 {
  text-wrap: normal !important; /* Override the text-wrap-balance */
  animation: textPulse 4s ease-in-out infinite;
}

h2:hover span:first-child {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.font-space {
  font-family: 'Orbitron', sans-serif;
}

.font-subtitle {
  font-family: 'Space Grotesk', sans-serif;
}

/* Optional: Add text shadow animation */
@keyframes textPulse {
  0%,
  100% {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  }
  50% {
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
  }
}

h2 {
  animation: textPulse 4s ease-in-out infinite;
}
</style>
