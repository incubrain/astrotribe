<script setup lang="ts">
defineProps({
  event: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

// Inject utilities from parent
const { getCategoryIcon, getCategoryColor, getCategoryIntensity } = useEventCategories()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div
    class="bg-primary-900/40 backdrop-blur-md border border-primary-800/30 rounded-lg p-3 cursor-pointer hover:bg-primary-800/50 transition-all duration-300 transform hover:-translate-y-0.5"
    @click="$emit('click', event)"
  >
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-2">
        <div
          :class="`bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/20 text-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)} p-1.5 rounded-full flex`"
        >
          <Icon
            :name="getCategoryIcon(event.category)"
            size="18px"
          />
        </div>
        <div>
          <h4 class="font-medium">{{ event.title }}</h4>
          <p class="text-xs text-gray-400">{{ formatDate(event.date) }}</p>
        </div>
      </div>
      <div
        v-if="event.time"
        class="bg-primary-950/50 px-2 py-0.5 rounded text-xs"
      >
        {{ event.time }}
      </div>
    </div>
  </div>
</template>
