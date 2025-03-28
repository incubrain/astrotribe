<script setup lang="ts">
import type { Job } from '~/types/jobs'
import { calculateDaysToDeadline, formatSalary } from '~/utils/jobFormatters'

interface Props {
  job: Job
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'filterTag', tag: string): void
}>()

// Calculate deadline days remaining
const daysRemaining = computed(() => {
  if (!props.job.expires_at) return null
  return calculateDaysToDeadline(props.job.expires_at)
})

// Format salary with appropriate currency
const formattedSalary = computed(() => {
  if (!props.job.salary) return ''
  return formatSalary(props.job.salary, 'EUR')
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
    const { addToRecentlyViewedJobs } = useJobStorage()
    addToRecentlyViewedJobs(props.job.id)
  }
})
</script>

<template>
  <div class="relative h-full overflow-hidden">
    <!-- Featured badge -->
    <div
      v-if="job.featured"
      class="absolute -top-3 -left-3 z-10"
    >
      <div class="relative">
        <!-- Glow effect -->
        <div class="absolute inset-0 blur-md bg-jobs-primary/30 rounded-full"></div>
        <!-- Badge -->
        <div
          class="relative bg-gradient-to-r from-jobs-primary to-jobs-accent pl-3 pt-3 pr-1 pb-1 rounded-full shadow-lg border border-white/20"
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

    <!-- Main Card -->
    <div
      class="group h-full bg-primary bg-opacity-20 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-jobs-primary/20 relative overflow-hidden rounded-2xl flex flex-col"
      :class="job.featured ? 'border-jobs-primary/30 rounded-tr-2xl rounded-bl-2xl' : ''"
    >
      <!-- Enhanced gradient background for featured jobs -->
      <div
        class="absolute inset-0 bg-gradient-to-br pointer-events-none"
        :class="
          job.featured ? 'from-jobs-primary/5 to-jobs-accent/5' : 'from-transparent to-gray-50/50'
        "
      ></div>

      <div class="flex justify-between items-start relative gap-4 mb-auto">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <!-- Add deadline indicator -->
            <DeadlineIndicator
              v-if="job.expires_at"
              :deadline="job.expires_at"
              size="sm"
              indicator-only
            />

            <!-- Add TimeAgo for publication date -->
            <TimeAgo
              v-if="job.published_at"
              :date="job.published_at"
              prefix="Posted"
              compact
              text-class="text-xs text-gray-400"
            />
          </div>

          <h2
            class="text-xl text-white font-semibold text-gray-900 group-hover:text-jobs-primary transition-colors duration-300"
          >
            {{ job.title }}
          </h2>
          <div class="flex text-white flex-col">
            <span
              v-if="job.employmentType"
              class="font-medium"
              >{{ job.employmentType }}</span
            >
            <span class="font-medium">{{ job.company }}</span>
            <!-- Verified badge if needed -->
            <span
              v-if="job.verified"
              class="text-jobs-primary/80 flex items-center gap-1"
            >
              <Icon
                name="material-symbols:verified"
                class="w-4 h-4"
              />
              <span class="text-xs">Verified</span>
            </span>
          </div>
        </div>

        <!-- Salary display -->
        <span
          v-if="job.salary"
          class="bg-jobs-primary/10 text-white text-xs text-jobs-primary px-4 py-2 rounded-full font-semibold backdrop-blur-sm shadow-sm"
        >
          {{ formattedSalary }}
        </span>
      </div>

      <!-- Location with icon -->
      <div
        v-if="job.location"
        class="mt-4 flex items-center text-gray-600 space-x-4"
      >
        <div class="flex items-center space-x-2">
          <Icon
            name="uil:location-point"
            color="white"
            class="w-5 h-5 text-white text-jobs-primary/70"
          />
          <span class="text-sm text-white font-medium">{{ job.location }}</span>
        </div>
      </div>

      <!-- Dates section with enhanced display -->
      <div class="flex text-white items-center space-x-2 mt-2">
        <Icon
          name="uil:clock"
          color="white"
          class="w-4 h-4 text-jobs-primary/70"
        />

        <!-- Publication date -->
        <span
          v-if="job.publishedAt"
          class="text-sm"
        >
          {{ job.publishedAt }}
        </span>

        <!-- Expiration date with countdown -->
        <template v-if="job.expiresAt">
          <span class="text-gray-400 mx-1">•</span>
          <DeadlineIndicator
            :deadline="job.expires_at"
            size="sm"
            :show-icon="false"
          />
        </template>
      </div>

      <!-- Tags section -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="tag in job.tags"
          :key="tag"
          class="bg-gray-50 text-xs text-gray-600 px-4 py-1.5 rounded-full font-medium hover:bg-jobs-accent/10 hover:text-jobs-accent transition-all duration-300 border border-transparent hover:border-jobs-accent/20"
          @click="emit('filterTag', tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Apply button -->
      <NuxtLink
        :to="job.url"
        target="_blank"
        class="mt-6 flex text-primary-500 items-center justify-center w-full bg-white text-jobs-primary border border-jobs-primary/20 px-6 py-3 rounded-xl font-medium hover:bg-jobs-primary hover:text-black transition-all duration-300 group-hover:shadow-md space-x-2"
        external
      >
        <span>View Details</span>
        <Icon
          name="heroicons:arrow-right"
          class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
        />
      </NuxtLink>

      <!-- Company domain display -->
      <div
        v-if="companyDomain"
        class="mt-2 text-center text-xs text-gray-400"
      >
        {{ companyDomain }}
      </div>
    </div>
  </div>
</template>
