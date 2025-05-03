<script setup lang="ts">
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  viewMode: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:searchQuery', 'update:viewMode'])

const updateSearchQuery = (event) => {
  emit('update:searchQuery', event.target.value)
}

const updateViewMode = (mode) => {
  emit('update:viewMode', mode)
}
</script>

<template>
  <div
    class="mb-6 bg-primary-900/40 backdrop-blur-md border border-primary-800/20 rounded-lg p-4 max-w-full"
  >
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <!-- Search -->
      <div class="relative w-full md:min-w-64">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search events..."
          class="w-full bg-primary-950/70 text-white border border-primary-800 rounded-md pl-8 py-2 focus:ring-1 focus:ring-primary-600 focus:outline-none"
          @input="updateSearchQuery"
        />
        <Icon
          name="i-lucide-search"
          class="absolute left-2 top-2.5 text-gray-400"
          size="16px"
        />
      </div>

      <!-- View Switcher -->
      <div class="flex items-center gap-2 border-l border-primary-800/30 pl-4 shrink-0">
        <PrimeButton
          rounded
          text
          :severity="viewMode === 'month' ? 'primary' : 'secondary'"
          aria-label="Month view"
          @click="updateViewMode('month')"
        >
          <Icon
            name="i-lucide-calendar"
            size="24px"
          />
        </PrimeButton>
        <PrimeButton
          rounded
          text
          :severity="viewMode === 'list' ? 'primary' : 'secondary'"
          aria-label="List view"
          @click="updateViewMode('list')"
        >
          <Icon
            name="i-lucide-grid"
            size="24px"
          />
        </PrimeButton>
      </div>
    </div>
  </div>
</template>
