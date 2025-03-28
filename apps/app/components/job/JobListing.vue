<script setup lang="ts">
import type { Job } from '~/types/jobs'

interface Props {
  jobs: Job[]
  loading?: boolean
  viewMode?: 'grid' | 'list'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'filterTag', tag: string): void
}>()

// Sort jobs to show featured ones first
const sortedJobs = computed(() => {
  return [...props.jobs].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })
})

// Empty state message
const emptyStateMessage = computed(() => {
  if (props.loading) return 'Loading job opportunities...'
  if (!props.jobs.length) return 'No job opportunities match your criteria'
  return ''
})

// Class based on view mode
const containerClass = computed(() => {
  return props.viewMode === 'list'
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
})
</script>

<template>
  <div>
    <div
      v-if="emptyStateMessage && !jobs.length"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="bg-primary-900/50 p-8 rounded-xl border border-primary-800/30 w-full max-w-md">
        <div class="mb-4">
          <Icon
            v-if="loading"
            name="mdi:loading"
            class="w-12 h-12 text-primary-500 animate-spin"
          />
          <Icon
            v-else
            name="mdi:briefcase-search"
            class="w-12 h-12 text-primary-500"
          />
        </div>
        <h3 class="text-xl font-medium mb-2">{{ emptyStateMessage }}</h3>
        <p
          v-if="!loading && !jobs.length"
          class="text-gray-400"
        >
          Try adjusting your filters or search criteria
        </p>
      </div>
    </div>

    <div
      v-else
      :id="'job-list'"
      :class="[containerClass, { 'opacity-50': loading }]"
    >
      <Transition-group
        name="job-cards"
        tag="div"
        :class="containerClass"
      >
        <template v-if="loading">
          <JobCardSkeleton
            v-for="index in 6"
            :key="`skeleton-${index}`"
          />
        </template>
        <template v-else>
          <JobCard
            v-for="job in sortedJobs"
            :key="job.id"
            :job="job"
            class="job-card-item"
            @filter-tag="emit('filterTag', $event)"
          />
        </template>
      </Transition-group>
    </div>
  </div>
</template>

<style scoped>
.job-cards-move,
.job-cards-enter-active,
.job-cards-leave-active {
  transition: all 0.5s ease;
}

.job-cards-enter-from,
.job-cards-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.job-cards-leave-active {
  position: absolute;
}

.job-card-item {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
