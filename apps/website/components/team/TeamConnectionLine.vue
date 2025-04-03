<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

// Props for team members count
const props = defineProps({
  memberCount: {
    type: Number,
    required: true,
  },
})

// References to store connection point positions
const connectionPoints = ref([] as { x: number; y: number }[])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationFrameId = ref<number | null>(null)
const isVisible = ref(false)

// Calculate positions based on team member cards
const calculatePositions = () => {
  const newPoints = [] as { x: number; y: number }[]

  // Find all connection points in the DOM
  const points = document.querySelectorAll('.connection-point')

  points.forEach((point) => {
    // Get position relative to the document
    const rect = point.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft

    newPoints.push({
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop + rect.height / 2,
    })
  })

  connectionPoints.value = newPoints
}

// Draw connection lines on canvas
const drawConnections = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Update canvas size to match window
  canvas.width = window.innerWidth
  canvas.height = document.body.scrollHeight

  // Don't draw if not enough points
  if (connectionPoints.value.length < 2) return

  // Draw lines between nearby points
  for (let i = 0; i < connectionPoints.value.length; i++) {
    const current = connectionPoints.value[i]

    // Connect to the next 2-3 points if they exist
    for (let j = i + 1; j < Math.min(i + 3, connectionPoints.value.length); j++) {
      const next = connectionPoints.value[j]

      // Calculate distance for opacity
      const dx = next.x - current.x
      const dy = next.y - current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Skip if too far away
      if (distance > 500) continue

      // Set line style with opacity based on distance
      const opacity = Math.max(0.05, 0.5 - distance / 1000)
      ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
      ctx.lineWidth = 1

      // Draw the line with animated dash
      ctx.beginPath()

      // Create dashed line effect
      ctx.setLineDash([5, 5])
      // Animate the dash by offsetting based on time
      ctx.lineDashOffset = -((Date.now() / 100) % 10)

      ctx.moveTo(current.x, current.y)
      ctx.lineTo(next.x, next.y)
      ctx.stroke()
    }
  }

  // Continue animation
  animationFrameId.value = requestAnimationFrame(drawConnections)
}

// Handle scroll and resize events
const handleResize = () => {
  calculatePositions()
}

// Check if connections are visible in viewport
const checkVisibility = () => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  isVisible.value =
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
}

// Watch for visibility changes to optimize performance
watch(isVisible, (newValue) => {
  if (newValue && !animationFrameId.value) {
    // Start animation when visible
    calculatePositions()
    animationFrameId.value = requestAnimationFrame(drawConnections)
  } else if (!newValue && animationFrameId.value) {
    // Stop animation when not visible
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
})

// Lifecycle hooks
onMounted(() => {
  if (!import.meta.client) return

  // Initial setup
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', checkVisibility)

  // Give time for the DOM to render
  setTimeout(() => {
    calculatePositions()
    checkVisibility()
  }, 500)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return

  // Clean up
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', checkVisibility)

  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="connection-canvas absolute top-0 left-0 w-full h-full pointer-events-none z-10"
  ></canvas>
</template>
