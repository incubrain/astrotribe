<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { activePersona, personas, setActivePersona } = usePersona()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()
// const { conf: motionConstants } = useAnimation() // Keep if used elsewhere, otherwise removable

const orbitRadius = ref(140) // The distance for non-active personas
const ellipticalFactor = ref(0.4) // Makes the arrangement wider than tall (0.4 in original) - adjust as needed (1 for circular)

// Calculate fixed positions based on the currently active persona
const getOrbitPositions = computed(() => {
  const positions: Record<
    string,
    {
      x: number
      y: number
      scale: number
      opacity: number
      active?: boolean
      rotation?: number // Keep rotation if icons should tilt
      zIndex: number
    }
  > = {}

  // Guard clause for safety
  if (!activePersona.value || !personas.value) {
    console.warn('getOrbitPositions: activePersona or personas not ready yet.')
    return {}
  }

  // Filter out the active persona to determine orbiting ones
  const orbitingPersonas = personas.value.filter((p) => p.name !== activePersona.value.name)
  const numOrbiting = orbitingPersonas.length

  personas.value.forEach((persona) => {
    if (persona.name === activePersona.value.name) {
      // Active persona is always in the center
      positions[persona.name] = {
        x: 0,
        y: 0,
        scale: 1.3, // Larger scale for active
        opacity: 1,
        active: true,
        zIndex: 10, // Highest z-index
        // No rotation needed for the center usually
      }
    } else {
      // Find the index of this persona within the *orbiting* list
      const index = orbitingPersonas.findIndex((p) => p.name === persona.name)

      // Calculate the angle for this orbiting persona
      // Distribute remaining personas evenly around the circle
      // Add a small offset (e.g., 90 degrees) to adjust the starting position if needed
      const angleOffset = 180 // Start positions at the top/bottom if elliptical, or adjust as desired
      const angle = angleOffset + (index * 360) / numOrbiting
      const radian = angle * (Math.PI / 180)

      // Calculate position based on radius and angle
      const x = Math.cos(radian) * orbitRadius.value
      // Apply elliptical factor to y - use 1 for a perfect circle
      const y = Math.sin(radian) * (orbitRadius.value * ellipticalFactor.value)

      positions[persona.name] = {
        x,
        y,
        scale: 0.8, // Smaller scale for orbiting
        opacity: 0.7, // Slightly faded for orbiting
        rotation: 0, // Angle persona icon towards center (optional, 0 keeps them upright)
        // If you want them to tilt towards center: use `angle - 90` or similar logic
        active: false,
        zIndex: 1, // Lower z-index
      }
    }
  })

  // --- Floating Effect (Optional Enhancement) ---
  // To add a subtle float, you could:
  // 1. CSS Animation: Apply a small, continuous CSS transform animation (e.g., translate up/down slightly)
  //    to the orbiting persona elements *in addition* to the style binding transform.
  // 2. JS Animation: Re-introduce a requestAnimationFrame loop that slightly modifies the x/y
  //    positions calculated above over time (e.g., using Math.sin(Date.now() * speed + offset)).
  // For now, we'll stick to fixed positions to solve the core issues.

  return positions
})

// Handle persona selection - simplified
const selectPersona = (persona: any) => {
  // Only proceed if a different persona is selected
  if (!persona || persona.name === activePersona.value?.name) return

  // Simply update the active persona. The computed property `getOrbitPositions`
  // will recalculate, and the CSS transition will handle the animation.
  setActivePersona(persona)

  // Track persona selection
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'select_persona',
    persona_name: persona.name,
  })
}

// No need for startOrbiting, animateOrbit, isOrbiting, isTransitioning, previousPersona anymore
// No onMounted needed for starting animation if we don't have a JS animation loop
</script>

<template>
  <div class="relative w-full aspect-video max-w-md mx-auto">
    <div
      ref="orbitCenter"
      class="absolute left-1/2 top-1/2 h-0 w-0"
    ></div>

    <div class="relative w-full h-full flex justify-center items-center">
      <div
        v-for="persona in personas"
        :key="persona.name"
        class="absolute transition-all duration-700 ease-in-out cursor-pointer"
        :style="{
          transform: `translate(${getOrbitPositions[persona.name]?.x || 0}px, ${getOrbitPositions[persona.name]?.y || 0}px) scale(${getOrbitPositions[persona.name]?.scale || 1}) rotate(${getOrbitPositions[persona.name]?.rotation || 0}deg)`, // Added rotate here
          opacity: getOrbitPositions[persona.name]?.opacity ?? 0, // Use nullish coalescing for safety
          zIndex: getOrbitPositions[persona.name]?.zIndex || 1,
        }"
        @click="selectPersona(persona)"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
          :class="`${persona.name === activePersona?.name ? `bg-${persona.color}-800 border-2 border-${persona.color}-500/70` : `bg-${persona.color}-900/50`}`"
        >
          <Icon
            :name="persona.iconName"
            class="transition-colors duration-500"
            :class="`text-${persona.color}-500`"
            size="30"
          />
        </div>

        <div
          class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-medium transition-opacity duration-500"
          :class="
            persona.name === activePersona?.name
              ? `text-${persona.color}-500 opacity-100`
              : 'text-gray-500 opacity-70'
          "
        >
          {{ persona.name }}
        </div>
        <div
          v-if="persona.name === activePersona?.name"
          class="mt-4 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow"
          :class="`bg-${activePersona.color}-800 text-${activePersona.color}-400`"
        >
          Selected
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
/* Example for subtle float using CSS animation (apply to orbiting personas): */
/* You might need to target non-active personas more specifically */
/*
.persona-orbiting {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--s, 1)) rotate(var(--r, 0deg)) translateY(0px);
  }
  50% {
     transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--s, 1)) rotate(var(--r, 0deg)) translateY(-6px);
  }
  100% {
     transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--s, 1)) rotate(var(--r, 0deg)) translateY(0px);
  }
}
*/
/* Note: Combining CSS animation transforms with style-bound transforms requires careful handling, often using CSS variables like shown above, which you'd set in the :style binding */
</style>
