<script setup lang="ts">
import { ref, computed } from 'vue'

const { conf: motionConstants } = useAnimation()
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
    shadowColor: 'shadow-slate-900/20',
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
    color: 'from-primary-600 to-blue-600',
    shadowColor: 'shadow-primary-900/30',
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
    color: 'from-indigo-600 to-purple-600',
    shadowColor: 'shadow-indigo-900/30',
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
    price = Math.round(price * 12 * (1 - discountPercentage / 100))
  }
  return `${plan.price.currency}${price}`
}

const getPeriod = (plan) => {
  if (plan.price.period === null) return ''
  return isAnnual.value ? '/year' : `/${plan.price.period}`
}
</script>

<template>
  <section
    id="pricing"
    class="py-20 md:py-28 relative"
  >
    <!-- Background with subtle gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary-950/70 to-slate-950 z-0"></div>

    <!-- Glow effects -->
    <div class="absolute left-0 top-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
    <div class="absolute right-0 bottom-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Simple,
          <span class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
            >Transparent</span
          >
          Pricing
        </h2>
        <p class="text-xl text-gray-300"> Choose the plan that fits your needs </p>
      </div>

      <!-- Billing toggle -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="flex justify-center items-center space-x-4 mt-8 mb-12"
      >
        <span class="text-gray-300">Monthly Billing</span>
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
        <span class="text-gray-300 flex items-center">
          Annual Billing
          <span
            class="text-xs bg-primary-900/30 text-primary-500 border border-primary-800/40 rounded-full px-2 py-0.5 ml-2"
          >
            Save {{ discountPercentage }}%
          </span>
        </span>
      </div>

      <!-- Pricing cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(plan, index) in plans"
          :key="plan.id"
          v-motion
          :initial="{
            opacity: 0,
            y: 50,
            scale: plan.popular ? 0.95 : 0.9,
          }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 150,
              damping: 20,
              delay: 0.3 + index * 0.15,
            },
          }"
          class="relative group"
        >
          <!-- Popular badge -->
          <div
            v-if="plan.popular"
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.8 } }"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div
              class="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg shadow-primary-900/30"
            >
              Most Popular
            </div>
          </div>

          <!-- Card with glass effect -->
          <div
            class="relative h-full rounded-xl backdrop-blur-sm bg-slate-900/40 border transition-all duration-500 p-8 flex flex-col"
            :class="[
              plan.popular
                ? 'border-primary-800/50 shadow-lg shadow-primary-900/20'
                : 'border-slate-800/50 hover:border-primary-800/30 group-hover:shadow-lg',
            ]"
          >
            <!-- Subtle gradient overlay based on plan -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br rounded-xl"
              :class="plan.color"
            ></div>

            <!-- Card header -->
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
                v-for="(feature, featureIndex) in plan.features"
                :key="`${plan.id}-feature-${featureIndex}`"
                v-motion
                :initial="{ opacity: 0, x: -5 }"
                :visibleOnce="{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.5 + index * 0.15 + featureIndex * 0.03,
                  },
                }"
                class="flex items-start"
              >
                <div class="flex-shrink-0 mt-1">
                  <Icon
                    :name="feature.included ? 'mdi:check-circle' : 'mdi:close-circle'"
                    :class="feature.included ? 'text-primary-500' : 'text-gray-600'"
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
              <div
                class="p-0.5 rounded-md bg-gradient-to-r"
                :class="plan.color"
              >
                <PrimeButton
                  class="w-full border-none bg-slate-900 hover:bg-slate-800/80 text-white transition-all duration-300 shadow-lg"
                  :class="plan.shadowColor"
                >
                  {{ plan.cta }}
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enterprise info -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.8 } }"
        class="mt-16 rounded-xl bg-slate-900/50 border border-primary-800/20 p-8 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300 hover:border-primary-800/30"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div class="md:col-span-2">
            <h3 class="text-2xl font-bold text-white mb-4">Need a custom solution?</h3>
            <p class="text-gray-300 mb-6">
              Our enterprise plan offers customized solutions for research institutions,
              universities, and organizations with specialized needs. Contact us to discuss your
              requirements and get a tailored quote.
            </p>
            <div class="space-y-2">
              <div
                v-for="(feature, idx) in [
                  'Custom API integration with your existing research tools',
                  'Dedicated onboarding and training sessions',
                  '24/7 priority support with guaranteed response times',
                ]"
                :key="idx"
                v-motion
                :initial="{ opacity: 0, x: -10 }"
                :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.9 + idx * 0.1 } }"
                class="flex items-center gap-2 text-gray-300"
              >
                <Icon
                  name="mdi:check-circle"
                  class="text-primary-500"
                  size="20"
                />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, x: 20 }"
            :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.9 } }"
            class="md:col-span-1 flex justify-center md:justify-end"
          >
            <div class="p-0.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600">
              <PrimeButton
                size="large"
                class="bg-slate-900 hover:bg-slate-800/80 text-white shadow-lg shadow-indigo-900/20 transition-all duration-300 border-none"
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
      </div>

      <!-- FAQ teaser -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 1 } }"
        class="mt-16 text-center"
      >
        <h3 class="text-xl font-medium text-white mb-4">Have questions about our plans?</h3>
        <PrimeButton
          outlined
          class="border-primary-800/40 text-primary-500 hover:border-primary-600 hover:bg-primary-900/20 transition-all duration-300"
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
.transition-all {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
