<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useCompanies, type Company } from '~/composables/useCompanies'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles } = usePersona()

// Get companies from our composable
const { allCompanies, companies, personaCompany, getCompanyById, visitWebsite } = useCompanies()

// Active company state
const activeCompany = ref<Company | null>(null)

// Initialize active company based on persona
const getInitialCompany = (): Company | null => {
  // First try to get the persona-specific company
  if (personaCompany.value) return personaCompany.value

  // If no persona-specific company, get the first company
  if (companies.value.length > 0) {
    return companies.value[0] || null
  }

  return null
}

// Set initial active company
activeCompany.value = getInitialCompany()

// Update active company when persona changes
watch(
  () => activePersona.value,
  () => {
    activeCompany.value = getInitialCompany()
  },
)

// Select a specific company
const selectCompany = (companyId: number): void => {
  const company = getCompanyById(companyId)
  if (company) {
    activeCompany.value = company

    // Track company selection
    trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
      action: 'select_company',
      company_id: company.id,
      company_name: company.name,
    })
  }
}

// Handle visit website button click
const handleVisitWebsite = (company: Company): void => {
  // Track the action
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'visit_company_website',
    company_id: company.id,
    company_name: company.name,
  })

  // Use the composable method to open the website
  visitWebsite(company)
}

// Track when users click "View All Companies"
const trackViewAllCompanies = (): void => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'view_all_companies',
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
          Astronomy Organizations
        </h2>
        <p class="text-gray-300 text-lg">
          Explore leading organizations in astronomy and space science that are pushing the
          boundaries of human knowledge.
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
            v-for="company in allCompanies"
            :key="`rec-${company.id}`"
            class="bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800/50 p-4 transition-all duration-300 cursor-pointer"
            :class="
              activeCompany && company.id === activeCompany.id
                ? `border-${company.color}-500/50 bg-${company.color}-900/20`
                : `hover:border-${company.color}-800/30`
            "
            @click="selectCompany(company.id)"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${company.color}-900/50 text-${company.color}-500`"
              >
                <Icon
                  :name="company.icon"
                  size="16"
                />
              </div>
              <div class="text-left">
                <h4 class="font-medium text-white text-sm">{{ company.name }}</h4>
                <p class="text-xs text-gray-400">{{ company.industry }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company selection tabs -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
        class="flex flex-wrap justify-center gap-3 mb-10"
      >
        <button
          v-for="company in companies"
          :key="company.id"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeCompany && activeCompany.id === company.id
              ? `bg-${company.color}-500/20 text-${company.color}-300 border border-${company.color}-500/30`
              : 'bg-slate-800/30 text-gray-400 border border-slate-700/20 hover:bg-slate-800/50'
          "
          @click="selectCompany(company.id)"
        >
          <Icon
            :name="company.icon"
            size="16"
          />
          {{ company.name }}
        </button>
      </div>

      <!-- Company details display -->
      <div
        v-if="activeCompany"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.4 } }"
        class="max-w-4xl mx-auto"
      >
        <div
          class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden transition-all duration-500"
          :class="`border-${activeCompany.color}-800/30 shadow-xl shadow-${activeCompany.color}-900/10`"
        >
          <!-- Company header -->
          <div
            class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between transition-colors duration-500"
            :class="`bg-${activeCompany.color}-900/20`"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${activeCompany.color}-900/50 text-${activeCompany.color}-500`"
              >
                <Icon
                  :name="activeCompany.icon"
                  size="24"
                />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">{{ activeCompany.name }}</h3>
                <p class="text-gray-400"
                  >{{ activeCompany.industry }} • {{ activeCompany.location }}</p
                >
              </div>
            </div>
            <div>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-500"
                :class="`bg-${activeCompany.color}-900/50 text-${activeCompany.color}-400 border border-${activeCompany.color}-800/30`"
              >
                Est. {{ activeCompany.founded }}
              </span>
            </div>
          </div>

          <!-- Company details -->
          <div class="p-6">
            <div class="mb-6">
              <p class="text-gray-300">{{ activeCompany.description }}</p>
            </div>

            <div class="mb-6">
              <h4 class="text-lg font-medium text-white mb-2">Highlights</h4>
              <ul class="text-gray-300 list-disc pl-5 space-y-1">
                <li
                  v-for="(highlight, index) in activeCompany.highlights"
                  :key="index"
                >
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div class="flex flex-wrap justify-between items-center">
              <div class="mb-4 md:mb-0">
                <div class="text-sm text-gray-400 mb-1">Company Size</div>
                <div class="text-white font-medium">{{ activeCompany.size }}</div>
              </div>

              <PrimeButton
                class="transition-colors duration-500"
                :class="personaStyles.primaryButton"
                @click="handleVisitWebsite(activeCompany)"
              >
                <Icon
                  name="mdi:web"
                  class="mr-2"
                  size="16"
                />
                Visit Website
              </PrimeButton>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Companies button moved to bottom as CTA -->
      <div class="mt-12 text-center">
        <PrimeButton
          size="large"
          class="transition-colors duration-500"
          :class="personaStyles.primaryButton"
          @click="trackViewAllCompanies"
        >
          <Icon
            name="mdi:office-building"
            class="mr-2"
            size="20"
          />
          View All Organizations
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
