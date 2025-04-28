<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Button } from 'primevue'
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
const faqButton = ref<InstanceType<typeof Button> | null>(null)

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
      additionalInfo: 'Perfect for academic researchers and institutions',
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
  const monthly = planPrices.basic[currency].monthly
  const annual = planPrices.basic[currency].annual
  const isAnnual = isAnnualBilling.value
  const value = isAnnual ? annual : monthly
  const symbol = isIndian.value ? '₹' : '$'
  const period = isAnnual ? '/year' : '/month'

  return {
    value,
    symbol,
    period,
    annualSavings: isAnnual ? monthly * 12 - annual : undefined,
    originalMonthlyPrice: isAnnual ? monthly * 12 : undefined,
  }
})

const expertPrice = computed(() => {
  const currency = isIndian.value ? 'inr' : 'usd'
  const monthly = planPrices.expert[currency].monthly
  const annual = planPrices.expert[currency].annual
  const isAnnual = isAnnualBilling.value
  const value = isAnnual ? annual : monthly
  const symbol = isIndian.value ? '₹' : '$'
  const period = isAnnual ? '/year' : '/month'

  return {
    value,
    symbol,
    period,
    annualSavings: isAnnual ? monthly * 12 - annual : undefined,
    originalMonthlyPrice: isAnnual ? monthly * 12 : undefined,
  }
})

// Toggle billing cycle - fixed to properly handle click events
const toggleBillingCycle = () => {
  try {
    trackUserAcquisition(UserAcquisitionMetric.FeaturePageEngagement, {
      action: 'toggle_billing_cycle',
      value: isAnnualBilling.value ? 'annual' : 'monthly',
      persona: activePersona.value.name,
    })
  } catch (error) {
    console.error('Error tracking billing cycle toggle:', error)
  }
}

// Track CTA clicks
const trackCtaClick = (plan) => {
  try {
    trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
      plan,
      billing_cycle: isAnnualBilling.value ? 'annual' : 'monthly',
      currency: isIndian.value ? 'inr' : 'usd',
      persona: activePersona.value.name,
    })
  } catch (error) {
    console.error('Error tracking CTA click:', error)
  }
}

// Open FAQ popover - fixed to center the popover on the button
const openFaqPopover = (event) => {
  if (faqPopover.value && faqButton.value?.$el) {
    faqPopover.value.toggle({ currentTarget: faqButton.value.$el })
  }
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

  // Make sure toggle is properly initialized
  const toggle = document.querySelector('.p-inputswitch')
  if (toggle) {
    toggle.addEventListener('click', toggleBillingCycle)
  }
})
</script>

<template>
  <section class="py-16 md:py-20 relative overflow-hidden">
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header section -->
      <LundTitle
        :title="{
          main: 'Simple, Transparent Pricing',
          subtitle: 'Choose the plan that fits your needs',
        }"
        alignment="center"
        dynamic-styling
        class="max-w-3xl mx-auto"
      >
        <div class="flex items-center justify-center gap-3 pt-6">
          <!-- Monthly Button -->
          <PrimeToggleButton
            :model-value="!isAnnualBilling"
            :on-label="'Monthly'"
            :off-label="'Monthly'"
            :aria-label="'Select Monthly Billing'"
            class="min-w-24"
            :pt="{
              content: {
                class: 'bg-transparent',
              },
              root: {
                class: !isAnnualBilling
                  ? `text-white border-${activePersona.color}-500/60 bg-${activePersona.color}-800`
                  : 'bg-slate-800 text-gray-400 border-slate-700',
              },
            }"
            @click="
              () => {
                ;(isAnnualBilling = false), toggleBillingCycle()
              }
            "
          />

          <!-- Annually Button -->
          <div class="relative">
            <PrimeToggleButton
              :model-value="isAnnualBilling"
              :on-label="'Annually Save 20%'"
              :off-label="'Annually Save 20%'"
              :aria-label="'Select Annual Billing'"
              class="min-w-24"
              :pt="{
                content: {
                  class: 'bg-transparent',
                },
                root: {
                  class: isAnnualBilling
                    ? `text-white border-${activePersona.color}-500/60 bg-${activePersona.color}-800`
                    : 'bg-slate-800 text-gray-400 border-slate-700',
                },
              }"
              @click="
                () => {
                  ;(isAnnualBilling = true), toggleBillingCycle()
                }
              "
            />
          </div>
        </div>
      </LundTitle>

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
        >
          <PricingCard
            title="Free"
            description="Perfect for casual learners and space enthusiasts"
            price="0"
            currency=""
            period="/month"
            :features="[
              'Basic AstronEra access',
              'Daily news digest',
              'Community access',
              'Limited searches per day',
            ]"
            :disabled-features="[
              'Knowledge Clusters',
              'API access',
              personaFeatures.specialFeature,
            ]"
            button-text="Sign Up Free"
            @action="trackCtaClick('free')"
          />
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
        >
          <PricingCard
            title="Basic"
            description="For serious researchers and astronomy enthusiasts"
            :price="basicPrice.value"
            :annual-savings="basicPrice.annualSavings"
            :original-monthly-price="basicPrice.originalMonthlyPrice"
            :currency="basicPrice.symbol"
            :period="basicPrice.period"
            :features="[
              'Everything in Free plan',
              'Unlimited searches',
              'Advanced filtering',
              'Knowledge clusters',
              'Priority support',
              personaFeatures.specialFeature,
            ]"
            :special-feature="personaFeatures.specialFeature"
            popular
            button-text="Get Basic"
            @action="trackCtaClick('basic')"
          />
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
        >
          <PricingCard
            title="Expert"
            description="For professional researchers and organizations"
            :price="expertPrice.value"
            :annual-savings="expertPrice.annualSavings"
            :original-monthly-price="expertPrice.originalMonthlyPrice"
            :currency="expertPrice.symbol"
            :period="expertPrice.period"
            :features="[
              'All Basic features',
              'Team collaboration',
              'Unlimited API access',
              'Advanced analytics',
              'Dedicated support',
              'Enterprise integrations',
            ]"
            coming-soon
            button-text="Join Waitlist"
            :button-disabled="true"
          />
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

        <div class="relative">
          <PrimeButton
            ref="faqButton"
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

          <!-- Fixed FAQ Popover with dark mode styling -->
          <PrimePopover
            ref="faqPopover"
            :target="faqButton?.$el"
            position="top"
            class="dark-mode-popover"
          >
            <div class="p-5 max-w-md max-h-96 overflow-y-auto bg-slate-800 text-white rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-white">Frequently Asked Questions</h3>

              <div class="space-y-4">
                <div
                  v-for="(faq, index) in faqs"
                  :key="index"
                  class="pb-3 border-b border-slate-700 last:border-0"
                >
                  <h4 class="font-medium text-gray-100 mb-1">{{ faq.question }}</h4>
                  <p class="text-sm text-gray-300">{{ faq.answer }}</p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-700 text-center">
                <p class="text-sm text-gray-300">
                  Still have questions?
                  <a
                    href="/contact"
                    class="font-medium hover:underline transition-colors duration-500"
                    :class="`text-${activePersona.color}-400`"
                    >Contact our team</a
                  >
                </p>
              </div>
            </div>
          </PrimePopover>
        </div>
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

/* Popover styling for dark mode */
:deep(.dark-mode-popover .p-component-overlay) {
  background-color: rgba(0, 0, 0, 0.6);
}

:deep(.dark-mode-popover.p-popover) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

:deep(.dark-mode-popover .p-popover-content) {
  padding: 0;
  background-color: #1e293b;
  color: white;
}

:deep(.dark-mode-popover .p-popover-arrow) {
  display: none;
}
</style>
