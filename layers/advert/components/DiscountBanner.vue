<template>
  <div
    class="promo-banner relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-lg p-8"
  >
    <!-- Animated stars background -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="i in 50"
        :key="i"
        class="star absolute bg-white rounded-full"
        :style="{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          animation: `twinkle ${2 + Math.random() * 3}s infinite`,
        }"
      >
      </div>
    </div>

    <!-- Main content -->
    <div class="relative z-10">
      <!-- Main grid layout -->
      <div class="grid grid-cols-[1fr_320px] gap-24">
        <!-- Left column -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h1
              class="text-5xl font-bold bg-clip-text text-transparent uppercase bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 leading-tight"
            >
              Join the Frontier
            </h1>
            <p class="text-xl font-semibold text-blue-200">
              Explore the Cosmos, Shape the Future
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 grid-flow-row-dense">
            <div class="flex items-center gap-3">
              <Icon
                name="mdi:star"
                size="30"
                class="text-yellow-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">50% OFF for life on all premium features</span>
            </div>
            <div class="flex items-center gap-4">
              <Icon
                name="mdi:rocket"
                size="30"
                class="text-purple-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">Exclusive beta access to new features</span>
            </div>
            <div class="flex items-center gap-4">
              <Icon
                name="mdi:crown"
                size="30"
                class="text-yellow-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">Recognition as a community leader</span>
            </div>
            <div class="flex items-center gap-3">
              <Icon
                name="mdi:star"
                size="30"
                class="text-yellow-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">50% OFF for life on all premium features</span>
            </div>
            <div class="flex items-center gap-4">
              <Icon
                name="mdi:rocket"
                size="30"
                class="text-purple-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">Exclusive beta access to new features</span>
            </div>
            <div class="flex items-center gap-4">
              <Icon
                name="mdi:crown"
                size="30"
                class="text-yellow-400 w-8 h-8"
              />
              <span class="text-lg text-blue-100">Recognition as a community leader</span>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="space-y-8">
          <div
            class="w-full aspect-square bg-white rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <p class="text-gray-400 text-sm text-center">QR Code Space</p>
          </div>
        </div>
      </div>

      <!-- Bottom section with progress bar and button -->
      <div class="mt-6">
        <div class="grid grid-cols-[1fr_320px] gap-24">
          <!-- Progress bar section -->
          <div class="space-y-3">
            <div class="flex justify-between text-blue-200">
              <span>ONLY 47 REMAINING</span>
            </div>
            <div class="w-full h-6 bg-purple-950/50 rounded-r-full rounded-l-lg overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-l-lg rounded-r-full transition-all duration-1000"
                style="width: 6%"
              >
              </div>
            </div>
          </div>

          <div class="w-full flex justify-center">
            <div class="flex items-center gap-4 text-blue-200">
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold">{{ countdown.seconds }}</span>
                <span class="text-xs uppercase">secs</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold">{{ countdown.minutes }}</span>
                <span class="text-xs uppercase">mins</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold">{{ countdown.hours }}</span>
                <span class="text-xs uppercase">hours</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold">{{ countdown.days }}</span>
                <span class="text-xs uppercase">days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const endDate = new Date('2025-01-16T23:59:59Z')

// Reactive countdown object
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// Function to update countdown
const updateCountdown = () => {
  const now = new Date()
  const timeDiff = endDate.getTime() - now.getTime()

  if (timeDiff > 0) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

    countdown.value = { days, hours, minutes, seconds }
  } else {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

// Set up timer
let timer: number

onMounted(() => {
  updateCountdown() // Initial update
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.custom-button {
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  border: none !important;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.3) !important;
  padding: 1.5rem 2.5rem !important;
  transition: all 0.3s ease !important;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.5) !important;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.star {
  box-shadow: 0 0 4px #fff;
}
</style>
