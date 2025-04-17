<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useOpportunities, type Opportunity } from '~/composables/useOpportunities'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles } = usePersona()

// Get opportunities from our composable
const {
  allOpportunities,
  opportunities,
  personaOpportunity,
  formatDate,
  getDaysRemaining,
  getOpportunityById,
  applyForOpportunity,
} = useOpportunities()

// Active opportunity state
const activeOpportunity = ref<Opportunity | null>(null)

// Initialize active opportunity based on persona
const getInitialOpportunity = (): Opportunity | null => {
  // First try to get the persona-specific opportunity
  if (personaOpportunity.value) return personaOpportunity.value

  // If no persona-specific opportunity, get the most recent opportunity
  if (opportunities.value.length > 0) {
    return opportunities.value[0] || null
  }

  return null
}

// Set initial active opportunity
activeOpportunity.value = getInitialOpportunity()

// Update active opportunity when persona changes
watch(
  () => activePersona.value,
  () => {
    activeOpportunity.value = getInitialOpportunity()
  },
)

// Select a specific opportunity
const selectOpportunity = (opportunityId: number): void => {
  const opportunity = getOpportunityById(opportunityId)
  if (opportunity) {
    activeOpportunity.value = opportunity

    // Track opportunity selection
    trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
      action: 'select_opportunity',
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
    })
  }
}

// Handle apply button click
const handleApply = (opportunity: Opportunity): void => {
  // Track the action
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'apply_for_opportunity',
    opportunity_id: opportunity.id,
    opportunity_title: opportunity.title,
  })

  // Use the composable method to open the apply link
  applyForOpportunity(opportunity)
}

// Track when users click "View All Opportunities"
const trackViewAllOpportunities = (): void => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'view_all_opportunities',
    persona: activePersona.value?.name || 'unknown',
  })
}
</script>

<template>
  <section class="py-16 md:py-20 relative overflow-hidden">
    <!-- Background with persona-specific gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/70 z-0 transition-colors duration-700"
    ></div>

    <!-- Background accents -->
    <div
      class="absolute left-0 top-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>
    <div
      class="absolute right-0 bottom-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-8"
      >
        <h2
          class="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500"
          :class="personaStyles.sectionHeading"
        >
          Astronomy Career Opportunities
        </h2>
        <p class="text-gray-300 text-lg">
          Discover exciting career opportunities in astronomy and space science that match your
          interests and expertise.
        </p>
      </div>

      <!-- Recommended for you section - Moved to top under subtitle -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="mb-10 text-center"
      >
        <h3 class="text-lg font-medium text-white mb-4 flex items-center justify-center gap-2">
          <Icon
            name="mdi:star"
            class="text-yellow-500"
            size="20"
          />
          <span>Recommended for {{ activePersona.name }}</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            v-for="opportunity in allOpportunities"
            :key="`rec-${opportunity.id}`"
            class="bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800/50 p-4 transition-all duration-300 cursor-pointer"
            :class="
              activeOpportunity && opportunity.id === activeOpportunity.id
                ? `border-${opportunity.color}-500/50 bg-${opportunity.color}-900/20`
                : `hover:border-${opportunity.color}-800/30`
            "
            @click="selectOpportunity(opportunity.id)"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${opportunity.color}-900/50 text-${opportunity.color}-500`"
              >
                <Icon
                  :name="opportunity.icon"
                  size="16"
                />
              </div>
              <div class="text-left">
                <h4 class="font-medium text-white text-sm">{{ opportunity.title }}</h4>
                <p class="text-xs text-gray-400">{{ opportunity.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Opportunity selection tabs -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
        class="flex flex-wrap justify-center gap-3 mb-10"
      >
        <button
          v-for="opportunity in opportunities"
          :key="opportunity.id"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeOpportunity && activeOpportunity.id === opportunity.id
              ? `bg-${opportunity.color}-500/20 text-${opportunity.color}-300 border border-${opportunity.color}-500/30`
              : 'bg-slate-800/30 text-gray-400 border border-slate-700/20 hover:bg-slate-800/50'
          "
          @click="selectOpportunity(opportunity.id)"
        >
          <Icon
            :name="opportunity.icon"
            size="16"
          />
          {{ opportunity.title }}
        </button>
      </div>

      <!-- Opportunity details display -->
      <div
        v-if="activeOpportunity"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.4 } }"
        class="max-w-4xl mx-auto"
      >
        <div
          class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden transition-all duration-500"
          :class="`border-${activeOpportunity.color}-800/30 shadow-xl shadow-${activeOpportunity.color}-900/10`"
        >
          <!-- Opportunity header -->
          <div
            class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between transition-colors duration-500"
            :class="`bg-${activeOpportunity.color}-900/20`"
          >
            <div>
              <h3 class="text-xl font-semibold text-white">{{ activeOpportunity.title }}</h3>
              <p class="text-gray-400"
                >{{ activeOpportunity.company }} • {{ activeOpportunity.location }}</p
              >
            </div>
            <div>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-500"
                :class="`bg-${activeOpportunity.color}-900/50 text-${activeOpportunity.color}-400 border border-${activeOpportunity.color}-800/30`"
              >
                {{ activeOpportunity.type }}
              </span>
            </div>
          </div>

          <!-- Opportunity details -->
          <div class="p-6">
            <div class="flex flex-wrap justify-between items-start mb-6">
              <div class="mb-4 md:mb-0">
                <div class="text-sm text-gray-400 mb-1">Salary Range</div>
                <div class="text-white font-medium">{{ activeOpportunity.salary }}</div>
              </div>
              <div class="mb-4 md:mb-0">
                <div class="text-sm text-gray-400 mb-1">Posted</div>
                <div class="text-white font-medium">{{
                  formatDate(activeOpportunity.postedDate)
                }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-400 mb-1">Application Deadline</div>
                <div class="text-white font-medium flex items-center gap-2">
                  {{ formatDate(activeOpportunity.deadline) }}
                  <span
                    class="px-2 py-0.5 rounded text-xs font-medium"
                    :class="
                      getDaysRemaining(activeOpportunity.deadline) < 7
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-green-900/50 text-green-400'
                    "
                  >
                    {{ getDaysRemaining(activeOpportunity.deadline) }} days left
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h4 class="text-lg font-medium text-white mb-2">Description</h4>
              <p class="text-gray-300">{{ activeOpportunity.description }}</p>
            </div>

            <div class="mb-6">
              <h4 class="text-lg font-medium text-white mb-2">Requirements</h4>
              <ul class="text-gray-300 list-disc pl-5 space-y-1">
                <li
                  v-for="(requirement, index) in activeOpportunity.requirements"
                  :key="index"
                >
                  {{ requirement }}
                </li>
              </ul>
            </div>

            <div class="flex justify-end">
              <PrimeButton
                class="transition-colors duration-500"
                :class="personaStyles.primaryButton"
                @click="handleApply(activeOpportunity)"
              >
                <Icon
                  name="mdi:send"
                  class="mr-2"
                  size="16"
                />
                Apply Now
              </PrimeButton>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Opportunities button moved to bottom as CTA -->
      <div class="mt-12 text-center">
        <PrimeButton
          size="large"
          class="transition-colors duration-500"
          :class="personaStyles.primaryButton"
          @click="trackViewAllOpportunities"
        >
          <Icon
            name="mdi:briefcase-search"
            class="mr-2"
            size="20"
          />
          View All Opportunities
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
