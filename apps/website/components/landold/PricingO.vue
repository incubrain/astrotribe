<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Pricing plans
const plans = ref([
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for casual learners and space enthusiasts',
    price: {
      value: 0,
      currency: '$',
      period: 'month',
    },
    features: [
      { text: 'Basic AstroQuery access', included: true },
      { text: 'Daily news digest', included: true },
      { text: 'Community access', included: true },
      { text: 'Limited searches per day', included: true },
      { text: 'Knowledge Clusters', included: false },
      { text: 'Custom contexts', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Sign Up Free',
    popular: false,
    color: 'from-slate-600 to-slate-500',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious researchers and astronomy enthusiasts',
    price: {
      value: 19,
      currency: '$',
      period: 'month',
    },
    features: [
      { text: 'Unlimited AstroQuery', included: true },
      { text: 'Advanced news filtering', included: true },
      { text: 'Knowledge Clusters', included: true },
      { text: 'Custom contexts', included: true },
      { text: 'Priority support', included: true },
      { text: 'Research analytics', included: true },
      { text: 'API access (limited)', included: true },
    ],
    cta: 'Get Premium',
    popular: true,
    color: 'from-primary-600 to-blue-500',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For universities, research institutions, and organizations',
    price: {
      value: null,
      label: 'Custom',
      period: null,
    },
    features: [
      { text: 'All Premium features', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Unlimited API access', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Training sessions', included: true },
    ],
    cta: 'Contact Us',
    popular: false,
    color: 'from-indigo-600 to-purple-500',
  },
])

// Toggle annual/monthly billing
const isAnnual = ref(false)
const discountPercentage = 20

// Calculate price with annual discount
const getPrice = (plan) => {
  if (plan.price.value === null) return plan.price.label

  let price = plan.price.value
  if (isAnnual.value) {
    price = price * 12 * (1 - discountPercentage / 100)
  }
  return `${plan.price.currency}${price}`
}

const getPeriod = (plan) => {
  if (plan.price.period === null) return ''
  return isAnnual.value ? '/year' : `/${plan.price.period}`
}

onMounted(() => {
  if (import.meta.client) {
    // Animate pricing cards
    gsap.from('.pricing-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="py-16 md:py-24 bg-slate-900/50">
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandTitle
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that fits your needs"
        gradient
      />

      <!-- Billing toggle -->
      <div class="flex justify-center items-center space-x-4 mt-8 mb-12">
        <span class="text-gray-400">Monthly Billing</span>
        <button
          class="relative w-14 h-7 bg-slate-700 rounded-full p-1 transition-colors duration-300"
          :class="{ 'bg-primary-600': isAnnual }"
          @click="isAnnual = !isAnnual"
        >
          <span
            class="absolute bg-white w-5 h-5 rounded-full transition-transform duration-300 transform"
            :class="isAnnual ? 'translate-x-7' : 'translate-x-0'"
          ></span>
        </button>
        <span class="text-gray-400">
          Annual Billing
          <span
            class="text-xs bg-primary-600/20 text-primary-600 border border-primary-600/30 rounded px-2 py-1 ml-1"
          >
            Save {{ discountPercentage }}%
          </span>
        </span>
      </div>

      <!-- Pricing cards -->
      <div class="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="pricing-card relative"
        >
          <!-- Popular badge -->
          <div
            v-if="plan.popular"
            class="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div
              class="bg-gradient-to-r from-primary-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              Most Popular
            </div>
          </div>

          <!-- Card with glass effect -->
          <div
            class="relative h-full rounded-xl backdrop-blur-sm bg-slate-900/30 border transition-all duration-500 p-8 flex flex-col"
            :class="[
              plan.popular
                ? 'border-primary-600/50 shadow-lg shadow-primary-600/20'
                : 'border-slate-800/50 hover:border-primary-600/30',
            ]"
          >
            <!-- Card content -->
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <p class="text-gray-400">{{ plan.description }}</p>
            </div>

            <!-- Price -->
            <div class="mb-8">
              <div class="flex items-end">
                <span class="text-4xl font-bold text-white">{{ getPrice(plan) }}</span>
                <span class="text-gray-400 ml-2">{{ getPeriod(plan) }}</span>
              </div>
            </div>

            <!-- Features list -->
            <div class="space-y-4 mb-8 flex-grow">
              <div
                v-for="(feature, index) in plan.features"
                :key="`${plan.id}-feature-${index}`"
                class="flex items-start"
              >
                <div class="flex-shrink-0 mt-1">
                  <Icon
                    :name="feature.included ? 'mdi:check-circle' : 'mdi:close-circle'"
                    :class="feature.included ? 'text-primary-600' : 'text-gray-600'"
                    size="20"
                  />
                </div>
                <span
                  class="ml-3"
                  :class="feature.included ? 'text-gray-300' : 'text-gray-500'"
                >
                  {{ feature.text }}
                </span>
              </div>
            </div>

            <!-- CTA button -->
            <div>
              <PrimeButton
                class="w-full"
                :class="[
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500'
                    : 'bg-slate-800 hover:bg-slate-700',
                ]"
              >
                {{ plan.cta }}
              </PrimeButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Enterprise info -->
      <div class="mt-16 rounded-xl bg-slate-900/50 border border-primary-600/20 p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div class="md:col-span-2">
            <h3 class="text-2xl font-bold text-white mb-4">Need a custom solution?</h3>
            <p class="text-gray-300 mb-6">
              Our enterprise plan offers customized solutions for research institutions,
              universities, and organizations with specialized needs. Contact us to discuss your
              requirements and get a tailored quote.
            </p>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-300">
                <Icon
                  name="mdi:check-circle"
                  class="text-primary-600"
                  size="20"
                />
                <span>Custom API integration with your existing research tools</span>
              </div>
              <div class="flex items-center gap-2 text-gray-300">
                <Icon
                  name="mdi:check-circle"
                  class="text-primary-600"
                  size="20"
                />
                <span>Dedicated onboarding and training sessions</span>
              </div>
              <div class="flex items-center gap-2 text-gray-300">
                <Icon
                  name="mdi:check-circle"
                  class="text-primary-600"
                  size="20"
                />
                <span>24/7 priority support with guaranteed response times</span>
              </div>
            </div>
          </div>
          <div class="md:col-span-1 flex justify-center md:justify-end">
            <PrimeButton
              size="large"
              class="bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 transition-all duration-300"
            >
              <Icon
                name="mdi:message"
                class="mr-2"
                size="20"
              />
              Schedule a Call
            </PrimeButton>
          </div>
        </div>
      </div>

      <!-- FAQ teaser -->
      <div class="mt-16 text-center">
        <h3 class="text-xl font-medium text-white mb-4">Have questions about our plans?</h3>
        <PrimeButton
          outlined
          class="border-primary-600/30 text-primary-600 hover:border-primary-600 transition-all duration-300"
        >
          View Frequently Asked Questions
          <Icon
            name="mdi:help-circle"
            class="ml-2"
            size="18"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-card {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
}
</style>
