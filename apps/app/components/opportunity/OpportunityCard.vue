<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Job } from '~/types/opportunities'

// Props
const props = defineProps<{
  job: Job
}>()

// Emits
const emit = defineEmits<{
  (e: 'filterTag', tag: string): void
}>()

// Handle tag click
const handleTagClick = (tag: string) => {
  emit('filterTag', tag)
}

// Calculate deadline days remaining
const daysRemaining = computed(() => {
  if (!props.job.expires_at) return null

  // This would normally use the calculateDaysToDeadline utility
  // Placeholder implementation
  const now = new Date()
  const expiryDate = new Date(props.job.expires_at)
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

// Format salary with appropriate currency
const formattedSalary = computed(() => {
  if (!props.job.salary) return ''

  // This would normally use the formatSalary utility
  // Placeholder implementation
  return props.job.salary
})

// Extract base domain from job URL
const companyDomain = computed(() => {
  if (!props.job.url) return ''
  try {
    const url = new URL(props.job.url)
    return url.hostname.replace('www.', '')
  } catch (e) {
    return ''
  }
})

// Track recent views if component is mounted
onMounted(() => {
  if (import.meta.client) {
    const jobStore = useOpportunityStore()
    jobStore.addToRecentlyViewedJobs?.(props.job)
  }
})

// Determine if the job is about to expire
const isAboutToExpire = computed(() => {
  if (!daysRemaining.value) return false
  return daysRemaining.value <= 7 && daysRemaining.value > 0
})
</script>

<template>
  <div
    class="group relative h-full overflow-hidden rounded-lg bg-primary-900/30 backdrop-blur-sm transition-all duration-300"
    :class="job.featured ? 'border-primary-500/30' : 'border border-primary-800/30'"
  >
    <!-- Featured badge with glow effect -->
    <div
      v-if="job.featured"
      class="absolute -top-3 -left-3 z-10"
    >
      <div class="relative">
        <!-- Glow effect -->
        <div class="absolute inset-0 blur-md bg-primary-500/30 rounded-full"></div>
        <!-- Badge -->
        <div
          class="relative bg-gradient-to-r from-primary-600 to-primary-400 pl-3 pt-3 pr-1 pb-1 rounded-full shadow-lg border border-white/20"
        >
          <div class="flex items-end h-full w-full justify-end">
            <Icon
              name="material-symbols:star-rounded"
              class="w-5 h-5 text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced gradient background for featured jobs -->
    <div
      class="absolute inset-0 bg-gradient-to-br pointer-events-none opacity-30"
      :class="job.featured ? 'from-primary-900 to-primary-700' : 'from-transparent to-primary-950'"
    ></div>

    <!-- Main content wrapper -->
    <div class="relative p-6 flex flex-col h-full">
      <div class="flex justify-between items-start gap-4 mb-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <!-- Deadline indicator -->
            <div
              v-if="daysRemaining !== null"
              class="flex items-center"
            >
              <Icon
                name="mdi:clock-time-four-outline"
                class="w-4 h-4 text-primary-400 mr-1"
              />
              <span
                class="text-xs font-medium"
                :class="isAboutToExpire ? 'text-amber-400' : 'text-primary-300'"
              >
                {{ daysRemaining }} days left
              </span>
            </div>

            <!-- Publication date -->
            <div
              v-if="job.publishedAt"
              class="flex items-center"
            >
              <span
                v-if="daysRemaining !== null"
                class="mx-1 text-primary-700"
                >•</span
              >
              <span class="text-xs text-gray-400">Posted {{ job.publishedAt }}</span>
            </div>

            <!-- New job indicator -->
            <span
              v-if="job.publishedAt && job.publishedAt.includes('day')"
              class="px-1.5 py-0.5 text-xs font-medium bg-green-900/50 text-green-400 rounded-full"
            >
              New
            </span>
          </div>

          <h3
            class="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors duration-300"
          >
            {{ job.title }}
          </h3>

          <div class="flex flex-col">
            <span
              v-if="job.employmentType"
              class="text-sm font-medium text-gray-300"
            >
              {{ job.employmentType }}
            </span>

            <div class="flex items-center gap-1">
              <span class="text-sm font-medium text-gray-300">{{ job.company }}</span>
              <!-- Verified badge if applicable -->
              <Icon
                v-if="job.verified"
                name="material-symbols:verified"
                class="w-4 h-4 text-primary-400"
                title="Verified employer"
              />
            </div>
          </div>
        </div>

        <!-- Salary display if available -->
        <div
          v-if="formattedSalary"
          class="bg-primary-900/70 text-primary-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm border border-primary-700/30"
        >
          {{ formattedSalary }}
        </div>
      </div>

      <!-- Location with icon -->
      <div
        v-if="job.location"
        class="flex items-center mb-3"
      >
        <Icon
          name="mdi:map-marker-outline"
          class="w-4 h-4 mr-2 text-primary-400"
        />
        <span class="text-sm text-gray-300">{{ job.location }}</span>
      </div>

      <!-- Tags section with improved styling -->
      <div
        v-if="job.tags && job.tags.length"
        class="mt-4 flex flex-wrap gap-2"
      >
        <button
          v-for="tag in job.tags"
          :key="tag"
          class="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 bg-primary-900/70 text-primary-300 border border-primary-700/30 hover:bg-primary-800 hover:border-primary-500/50 hover:text-primary-200"
          @click.stop="handleTagClick(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Spacer to push button to bottom -->
      <div class="flex-grow my-2"></div>

      <!-- View details button -->
      <NuxtLink
        :to="job.url || `/opportunities/${job.id}`"
        :target="job.url ? '_blank' : '_self'"
        class="mt-4 inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 bg-primary-700 hover:bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-primary-900"
      >
        View Details
        <Icon
          name="mdi:arrow-right"
          class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
        />
      </NuxtLink>

      <!-- Company domain display -->
      <div
        v-if="companyDomain"
        class="mt-2 text-center text-xs text-gray-500"
      >
        {{ companyDomain }}
      </div>
    </div>
  </div>
</template>
