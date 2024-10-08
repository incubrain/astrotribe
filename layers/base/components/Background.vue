<template>
  <canvas
    ref="canvas"
    class="w-full h-full"
  />
</template>

<script setup lang="ts">
const CANVAS_WIDTH = computed(() => (window ? window.innerWidth : 0))
const CANVAS_HEIGHT = computed(() => (window ? window.innerHeight + 800 : 0))
const STAR_COUNT = 300 // Number of stars
const COLORS = ['#ffffff', '#ffcccb', '#add8e6'] // White, red, blue

// Refs
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

// Utility function to get random number within a range
function getRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Create stars array
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: getRandom(0, CANVAS_WIDTH.value),
  y: getRandom(0, CANVAS_HEIGHT.value),
  radius: getRandom(0.5, 2),
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  speed: 0.01, // Speed of movement
  initialX: 0,
  initialY: 0,
}))

// Initialize star positions
stars.forEach((star) => {
  star.initialX = star.x
  star.initialY = star.y
})

// Draw stars on canvas
function drawStars() {
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH.value, CANVAS_HEIGHT.value)

  stars.forEach((star) => {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = star.color
    ctx.shadowColor = star.color
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.closePath()

    // Update star position to follow an inverted arc path
    star.x -= star.speed
    star.y =
      star.initialY - Math.sin((star.x / CANVAS_WIDTH.value) * Math.PI) * (CANVAS_HEIGHT.value / 4)

    // Wrap stars around edges
    if (star.x < 0) {
      star.x = CANVAS_WIDTH.value
      star.initialY = getRandom(0, CANVAS_HEIGHT.value)
    }
  })

  // Request next animation frame
  animationFrameId = requestAnimationFrame(drawStars)
}

// Set up canvas and start animation
onMounted(() => {
  if (canvas.value) {
    canvas.value.width = CANVAS_WIDTH.value
    canvas.value.height = CANVAS_HEIGHT.value
    ctx = canvas.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, CANVAS_WIDTH.value, CANVAS_HEIGHT.value)
      drawStars()
    }
  }
})

// Clean up animation on component unmount
onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
canvas {
  width: 100vw;
  height: 120vh;
}
</style>
