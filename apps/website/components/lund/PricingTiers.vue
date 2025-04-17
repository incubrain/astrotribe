<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnalytics } from '#imports'

const { trackUserAcquisition, UserAcquisitionMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

// Toggle switch state
const isAnnualBilling = ref(false)
const discountPercentage = 20

// Ref for FAQ popover
const faqPopover = ref(null)

// Location detection state
const isIndian = ref(false)

// FAQs data
const faqs = [
  {
    question: 'What is included in the free plan?',
    answer:
      'The free plan includes basic access to AstroEra, daily news digest, community access, and limited searches per day.',
  },
  {
    question: 'How does the annual billing discount work?',
    answer: `When you choose annual billing, you receive a ${discountPercentage}% discount compared to monthly billing.`,
  },
  {
    question: 'Can I upgrade my plan later?',
    answer:
      'Yes, you can upgrade your plan at any time. Your new plan will be prorated based on the remaining time in your current billing cycle.',
  },
  {
    question: 'When will the Expert plan be available?',
    answer:
      'The Expert plan is currently in development and will be available later this year. Join our waitlist to be notified when it launches.',
  },
  {
    question: 'Do you offer educational discounts?',
    answer:
      'Yes, we offer special academic pricing for universities, research institutions, and students. Please contact our sales team for more information.',
  },
]

// Plan pricing based on location and billing cycle
const planPrices = {
  basic: {
    usd: { monthly: 10, annual: 96 }, // Annual price reflects 20% discount
    inr: { monthly: 799, annual: 7668 },
  },
  expert: {
    usd: { monthly: 45, annual: 432 },
    inr: { monthly: 3599, annual: 34550 },
  },
}

// Persona-specific pricing features
const personaFeatures = computed(() => {
  if (isResearcher.value) {
    return {
      highlight: 'Academic discounts available',
      specialFeature: 'Research data export',
      additionalInfo: 'Perfect for academic researcher and institutions',
    }
  } else if (isCommunicator.value) {
    return {
      highlight: 'Team plans available',
      specialFeature: 'Media kit generation',
      additionalInfo: 'Ideal for science communication professionals',
    }
  } else {
    return {
      highlight: 'Family plans available',
      specialFeature: 'Interactive learning tools',
      additionalInfo: 'Great for astronomy clubs and enthusiasts',
    }
  }
})

// Computed prices based on location and billing cycle
const basicPrice = computed(() => {
  const currency = isIndian.value ? 'inr' : 'usd'
  const cycle = isAnnualBilling.value ? 'annual' : 'monthly'
  const symbol = isIndian.value ? '₹' : '$'
  const period = isAnnualBilling.value ? '/year' : '/month'

  return {
    value: planPrices.basic[currency][cycle],
    symbol,
    period,
  }
})

const expertPrice = computed(() => {
  const currency = isIndian.value ? 'inr' : 'usd'
  const cycle = isAnnualBilling.value ? 'annual' : 'monthly'
  const symbol = isIndian.value ? '₹' : '$'
  const period = isAnnualBilling.value ? '/year' : '/month'

  return {
    value: planPrices.expert[currency][cycle],
    symbol,
    period,
  }
})

// Toggle billing cycle
const toggleBillingCycle = () => {
  isAnnualBilling.value = !isAnnualBilling.value

  // Track toggle event
  trackUserAcquisition(UserAcquisitionMetric.FeaturePageEngagement, {
    action: 'toggle_billing_cycle',
    value: isAnnualBilling.value ? 'annual' : 'monthly',
    persona: activePersona.value.name,
  })
}

// Track CTA clicks
const trackCtaClick = (plan) => {
  trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
    plan,
    billing_cycle: isAnnualBilling.value ? 'annual' : 'monthly',
    currency: isIndian.value ? 'inr' : 'usd',
    persona: activePersona.value.name,
  })
}

// Open FAQ popover
const openFaqPopover = (event) => {
  faqPopover.value?.toggle(event)
}

// Detect user location on component mount
onMounted(async () => {
  try {
    // In a real implementation, you would use a proper geolocation service
    // This is a simplified example that would be replaced with actual geolocation
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    isIndian.value = data.country === 'IN'
  } catch (error) {
    console.error('Error detecting location:', error)
    // Default to USD if location detection fails
    isIndian.value = false
  }
})
</script>

<template>
  <section class="py-16 md:py-20 relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/70 z-0"></div>

    <!-- Decorative elements -->
    <div
      class="absolute left-0 top-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>
    <div
      class="absolute right-0 bottom-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header section -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0, transition: { duration: 600 } },
        }"
        class="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Simple,
          <span
            class="transition-colors duration-500"
            :class="personaStyles.sectionHeading"
          >
            Transparent
          </span>
          Pricing
        </h2>
        <p class="text-xl text-gray-300 mb-8">Choose the plan that fits your needs</p>

        <!-- Billing toggle -->
        <div class="flex items-center justify-center space-x-4 mb-2">
          <span
            class="text-gray-300"
            :class="{ 'text-white font-medium': !isAnnualBilling }"
          >
            Monthly Billing
          </span>

          <PrimeToggleSwitch
            v-model="isAnnualBilling"
            aria-label="Toggle billing cycle"
            @click="toggleBillingCycle"
          />

          <span
            class="flex items-center"
            :class="{ 'text-white font-medium': isAnnualBilling }"
          >
            <span class="text-gray-300">Annual Billing</span>
            <span
              class="ml-2 text-xs rounded-full px-2 py-0.5 transition-colors duration-500"
              :class="`bg-${activePersona.color}-900/30 text-${activePersona.color}-500 border border-${activePersona.color}-800/40`"
            >
              Save {{ discountPercentage }}%
            </span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Free Plan -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 40, scale: 0.95 },
            enter: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.1 },
            },
          }"
          class="relative group"
        >
          <div
            class="h-full bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-800/30 hover:-translate-y-1"
          >
            <div class="p-6">
              <h3 class="text-2xl font-bold text-white mb-2">Free</h3>
              <p class="text-gray-400 text-sm mb-6"
                >Perfect for casual learners and space enthusiasts</p
              >

              <div class="flex items-end mb-8">
                <span class="text-4xl font-bold text-white">0</span>
                <span class="text-gray-400 ml-2">/month</span>
              </div>

              <div class="space-y-4 mb-8">
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-blue-500"
                    size="20"
                  />
                  <span class="text-gray-300">Basic AstronEra access</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-blue-500"
                    size="20"
                  />
                  <span class="text-gray-300">Daily news digest</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-blue-500"
                    size="20"
                  />
                  <span class="text-gray-300">Community access</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-blue-500"
                    size="20"
                  />
                  <span class="text-gray-300">Limited searches per day</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:close-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-gray-600"
                    size="20"
                  />
                  <span class="text-gray-500">Knowledge Clusters</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:close-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-gray-600"
                    size="20"
                  />
                  <span class="text-gray-500">API access</span>
                </div>
                <!-- Persona-specific feature -->
                <div class="flex items-start">
                  <Icon
                    name="mdi:close-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 text-gray-600"
                    size="20"
                  />
                  <span class="text-gray-500">{{ personaFeatures.specialFeature }}</span>
                </div>
              </div>

              <!-- CTA Button -->
              <PrimeButton
                class="w-full bg-slate-700 hover:bg-slate-600 border-none"
                @click="trackCtaClick('free')"
              >
                Sign Up Free
              </PrimeButton>
            </div>
          </div>
        </div>

        <!-- Basic Plan -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 40, scale: 0.95 },
            enter: {
              opacity: 1,
              y: 0,
              scale: 1.03,
              transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.2 },
            },
          }"
          class="relative group"
        >
          <!-- Popular tag -->
          <div class="absolute -top-3 inset-x-0 flex justify-center z-20">
            <span
              class="text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg transition-colors duration-500"
              :class="`bg-gradient-to-r from-${activePersona.color}-600 to-${activePersona.color === 'blue' ? 'primary' : activePersona.color}-600`"
            >
              Most Popular
            </span>
          </div>

          <div
            class="h-full bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-lg transition-colors duration-500"
            :class="`border border-${activePersona.color}-700/50 shadow-${activePersona.color}-900/10 hover:shadow-${activePersona.color}-900/20`"
          >
            <div class="p-8">
              <h3 class="text-2xl font-bold text-white mb-2">Basic</h3>
              <p class="text-gray-400 text-sm mb-6"
                >For serious researcher and astronomy enthusiasts</p
              >

              <div class="flex items-end mb-8">
                <span class="text-4xl font-bold text-white"
                  >{{ basicPrice.symbol }}{{ basicPrice.value }}</span
                >
                <span class="text-gray-400 ml-2">{{ basicPrice.period }}</span>
              </div>

              <div class="space-y-4 mb-8">
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Everything in Free plan</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Unlimited searches</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Advanced filtering</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Knowledge clusters</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Priority support</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">{{ personaFeatures.specialFeature }}</span>
                </div>
              </div>

              <!-- CTA Button -->
              <PrimeButton
                class="w-full border-none shadow transition-colors duration-500"
                :class="personaStyles.primaryButton"
                @click="trackCtaClick('basic')"
              >
                Get Basic
              </PrimeButton>
            </div>
          </div>
        </div>

        <!-- Expert Plan (Coming Soon) -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 40, scale: 0.95 },
            enter: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.3 },
            },
          }"
          class="relative group"
        >
          <!-- Coming soon badge -->
          <div class="absolute -top-3 right-4 z-10">
            <span
              class="text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md transition-colors duration-500"
              :class="`bg-${activePersona.color}-600/90`"
            >
              Coming Soon
            </span>
          </div>

          <div
            class="h-full bg-slate-900/60 backdrop-blur-sm border border-slate-800/30 rounded-xl overflow-hidden transition-all duration-300 opacity-80 hover:shadow-lg"
          >
            <div class="p-6">
              <h3 class="text-2xl font-bold text-white mb-2">Expert</h3>
              <p class="text-gray-400 text-sm mb-6"
                >For professional researcher and organizations</p
              >

              <div class="flex items-end mb-8">
                <span class="text-4xl font-bold text-white"
                  >{{ expertPrice.symbol }}{{ expertPrice.value }}</span
                >
                <span class="text-gray-400 ml-2">{{ expertPrice.period }}</span>
              </div>

              <div class="space-y-4 mb-8">
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">All Basic features</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Team collaboration</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Unlimited API access</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Advanced analytics</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Dedicated support</span>
                </div>
                <div class="flex items-start">
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
                    :class="`text-${activePersona.color}-500`"
                    size="20"
                  />
                  <span class="text-gray-300">Enterprise integrations</span>
                </div>
              </div>

              <!-- CTA Button -->
              <PrimeButton
                class="w-full border-none transition-colors duration-500"
                :class="`bg-${activePersona.color}-600/80 hover:bg-${activePersona.color}-600/90`"
                disabled
              >
                Join Waitlist
              </PrimeButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Persona-specific info -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.4 },
          },
        }"
        class="mt-8 text-center max-w-3xl mx-auto px-6 py-3 rounded-lg transition-colors duration-500"
        :class="`bg-${activePersona.color}-900/20 border border-${activePersona.color}-800/30`"
      >
        <p
          class="transition-colors duration-500"
          :class="`text-${activePersona.color}-400`"
        >
          <span class="font-bold">{{ personaFeatures.highlight }}</span>
          — {{ personaFeatures.additionalInfo }}
        </p>
      </div>

      <!-- FAQ Section -->
      <div
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.4 },
          },
        }"
        class="mt-16 text-center max-w-3xl mx-auto"
      >
        <h3 class="text-xl font-medium text-white mb-2">Have questions?</h3>
        <p class="text-gray-400 mb-4">Special academic pricing available on request</p>

        <PrimeButton
          class="text-nowrap transition-colors duration-500"
          outlined
          :class="personaStyles.secondaryButton"
          @click="openFaqPopover"
        >
          View FAQ
          <Icon
            name="mdi:help-circle-outline"
            class="ml-2"
          />
        </PrimeButton>

        <!-- FAQ Popover -->
        <PrimePopover ref="faqPopover">
          <div class="p-5 max-w-md max-h-96 overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Frequently Asked Questions</h3>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="pb-3 border-b border-gray-200 last:border-0"
              >
                <h4 class="font-medium text-gray-900 mb-1">{{ faq.question }}</h4>
                <p class="text-sm text-gray-600">{{ faq.answer }}</p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-200 text-center">
              <p class="text-sm text-gray-500">
                Still have questions?
                <a
                  href="#"
                  class="font-medium hover:underline transition-colors duration-500"
                  :class="`text-${activePersona.color}-600`"
                  >Contact our team</a
                >
              </p>
            </div>
          </div>
        </PrimePopover>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Toggle switch styling */
:deep(.p-inputswitch) {
  width: 2.75rem !important;
  height: 1.5rem !important;
}

:deep(.p-inputswitch .p-inputswitch-slider) {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(71, 85, 105, 0.3) !important;
  border-radius: 2rem !important;
}

:deep(.p-inputswitch .p-inputswitch-slider:before) {
  background: #e2e8f0 !important;
  width: 1rem !important;
  height: 1rem !important;
  left: 0.2rem !important;
  margin-top: -0.5rem !important;
  border-radius: 50% !important;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: rgba(37, 99, 235, 0.8) !important;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before) {
  transform: translateX(1.2rem) !important;
}

/* Popover styling */
:deep(.p-component-overlay) {
  background-color: rgba(0, 0, 0, 0.4);
}

:deep(.p-popover) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(30, 41, 59, 0.1);
}

:deep(.p-popover .p-popover-content) {
  padding: 0;
}
</style>
