<script setup lang="ts">
defineProps({
  categories: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div
    class="bg-primary-900/30 backdrop-blur-md border border-primary-800/20 rounded-lg p-4 space-y-6"
  >
    <h2 class="text-xl font-bold">Monthly Calendar<br />Astronomical Events</h2>

    <!-- Search Feature -->
    <div class="relative">
      <input
        type="text"
        placeholder="Search events..."
        class="w-full bg-primary-950/70 text-white border border-primary-800/50 rounded-md pl-8 py-2 focus:ring-1 focus:ring-primary-600 focus:outline-none"
      />
      <Icon
        name="i-lucide-search"
        class="absolute left-2 top-2.5 text-gray-400"
        size="16px"
      />
    </div>

    <!-- Event Categories -->
    <div>
      <h3 class="text-xl mb-3 flex items-center gap-2">
        <span>Event Categories</span>
        <Icon
          name="i-lucide-filter"
          size="18px"
          class="text-primary-400"
        />
      </h3>

      <ul class="space-y-3">
        <li
          v-for="category in categories"
          :key="category.name"
          class="flex items-center gap-2 group cursor-pointer"
        >
          <div
            :class="`flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-300 bg-${category.color}-${category.colorIntensity}/20 group-hover:bg-${category.color}-${category.colorIntensity}/30`"
          >
            <Icon
              :name="category.icon"
              size="16px"
              :class="`text-${category.color}-${category.colorIntensity}`"
            />
          </div>
          <span
            :class="`text-${category.color}-${parseInt(category.colorIntensity) - 100} group-hover:text-${category.color}-${parseInt(category.colorIntensity) - 200} transition-colors duration-300`"
          >
            {{ category.name }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Upcoming Events Preview -->
    <div class="space-y-3">
      <h3 class="text-xl">Upcoming Highlights</h3>

      <!-- Sample Event Cards -->
      <div
        class="bg-primary-900/40 backdrop-blur-md border border-primary-800/30 rounded-lg p-3 cursor-pointer hover:bg-primary-800/50 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="bg-red-500/20 text-red-400 p-1.5 rounded-full">
              <Icon
                name="mdi:meteor"
                size="18px"
              />
            </div>
            <div>
              <h4 class="font-medium">Lyrid Meteor Shower</h4>
              <p class="text-xs text-gray-400">April 22, 2025</p>
            </div>
          </div>
          <div class="bg-primary-950/50 px-2 py-0.5 rounded text-xs"> 22:00 - 04:00 </div>
        </div>
      </div>

      <div
        class="bg-primary-900/40 backdrop-blur-md border border-primary-800/30 rounded-lg p-3 cursor-pointer hover:bg-primary-800/50 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-full">
              <Icon
                name="mdi:moon-new"
                size="18px"
              />
            </div>
            <div>
              <h4 class="font-medium">Partial Solar Eclipse</h4>
              <p class="text-xs text-gray-400">March 29, 2025</p>
            </div>
          </div>
          <div class="bg-primary-950/50 px-2 py-0.5 rounded text-xs"> 09:00 - 12:00 </div>
        </div>
      </div>

      <div
        class="bg-primary-900/40 backdrop-blur-md border border-primary-800/30 rounded-lg p-3 cursor-pointer hover:bg-primary-800/50 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="bg-blue-500/20 text-blue-400 p-1.5 rounded-full">
              <Icon
                name="mdi:event-heart"
                size="18px"
              />
            </div>
            <div>
              <h4 class="font-medium">Telescope Workshop</h4>
              <p class="text-xs text-gray-400">March 8, 2025</p>
            </div>
          </div>
          <div class="bg-primary-950/50 px-2 py-0.5 rounded text-xs"> 19:00 - 21:00 </div>
        </div>
      </div>
    </div>

    <!-- Location-Based Info -->
    <div>
      <h3 class="text-lg font-medium mb-2">Your Location</h3>
      <div class="bg-primary-950/50 rounded-lg p-3 border border-primary-800/30">
        <div class="flex items-center gap-2 mb-2">
          <Icon
            name="i-lucide-map-pin"
            size="18px"
            class="text-primary-400"
          />
          <span>Pune, India</span>
        </div>
        <div class="text-sm text-gray-400"> Optimized event visibility for your location. </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add subtle animation to make sidebar more dynamic */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-6 > * {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.space-y-6 > *:nth-child(1) {
  animation-delay: 0.1s;
}
.space-y-6 > *:nth-child(2) {
  animation-delay: 0.2s;
}
.space-y-6 > *:nth-child(3) {
  animation-delay: 0.3s;
}
.space-y-6 > *:nth-child(4) {
  animation-delay: 0.4s;
}
.space-y-6 > *:nth-child(5) {
  animation-delay: 0.5s;
}
</style>
