<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  direction?: 'up' | 'down' | 'none'
  showParticles?: boolean
  contentId: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'none',
  showParticles: false,
})

const isAnimating = ref(false)

const createParticles = () => {
  // Debug logging
  console.log('Creating particles for ID:', props.contentId)

  const element = document.querySelector(`#vote-animate-${props.contentId}`)
  if (!element) {
    console.warn('Target element not found:', `#vote-animate-${props.contentId}`)
    return
  }

  const rect = element.getBoundingClientRect()
  console.log('Element position:', rect)

  const particles = 5
  const particleClass = `particle-${props.contentId}`

  // Remove any existing particles first
  document.querySelectorAll(`.${particleClass}`).forEach((el) => el.remove())

  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div')
    particle.className = particleClass

    // Position particle at button center
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2

    // Calculate random angle and distance
    const angle = Math.random() * Math.PI * 2
    const distance = 30 + Math.random() * 20 // 30-50px distance

    // Calculate end position
    const endX = startX + Math.cos(angle) * distance
    const endY = startY + Math.sin(angle) * distance

    // Set initial position
    particle.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: 8px;
      height: 8px;
      background-color: #3B82F6;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform-origin: center center;
    `

    document.body.appendChild(particle)

    // Force a reflow
    void particle.offsetWidth

    // Add animation styles
    particle.style.transition = 'all 500ms ease-out'
    particle.style.transform = 'translate(0, 0) scale(1)'
    particle.style.opacity = '1'

    // Animate to end position
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0)`
      particle.style.opacity = '0'
    })

    // Cleanup
    setTimeout(() => {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle)
      }
    }, 1000)
  }
}

const triggerAnimation = () => {
  console.log('Animation triggered, showParticles:', props.showParticles)
  isAnimating.value = true

  if (props.showParticles) {
    createParticles()
  }

  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

defineExpose({ triggerAnimation })
</script>

<template>
  <div
    :id="`vote-animate-${contentId}`"
    class="relative inline-block"
    :class="{
      'scale-animation': isAnimating,
      'translate-up': isAnimating && direction === 'up',
      'translate-down': isAnimating && direction === 'down',
    }"
  >
    <slot />
  </div>
</template>

<style>
.animation-wrapper {
  transition: transform 0.2s ease;
  position: relative; /* Ensure this is positioned relative to its parent */
}

.scale-animation {
  animation: popAnimation 300ms ease-in-out;
}

.translate-up {
  transform: translateY(-2px);
}

.translate-down {
  transform: translateY(2px);
}

@keyframes popAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
