<!-- components/settings/PaymentSection.vue -->
<script setup lang="ts">

const { profile } = useCurrentUser()

const { store: subscriptionStore } = await useSelectData('customer_subscriptions', {
  filters: {
    user_id: { eq: profile.id },
  },
  initialFetch: true,
  storeKey: 'subscriptions',
})

const { store, loadMore } = await useSelectData('customer_subscription_plans', {
  initialFetch: true,
  storeKey: 'subscription_plans',
})

const { items } = storeToRefs(store)

const { items: subscriptionItems } = storeToRefs(subscriptionStore)

const subscription = computed(() => subscriptionItems.value?.[0])

interface PlanConfig {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isActive: boolean
  availableFrom: string | null
  razorpayConfig?: {
    subscription_id: string
    amount: number
  }
}

const plans = computed<PlanConfig>(() =>
  [
    {
      id: 1,
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Get started with free features',
      features: [
        'Basic project access',
        'Community support',
        '2 team members',
        '1GB storage',
        'Basic analytics',
      ],
      isActive: profile.user_plan === 'free',
      availableFrom: null,
    },
  ].concat(
    items.value.map((item: any) => {
      const isActive = profile.user_plan === item.name.toLowerCase()

      const razorPayConfig = isActive &&
        subscription.value && {
          subscription_id: subscription.value.external_subscription_id,
          subscription_status: subscription.value.status,
        }

      return {
        ...item,
        availableFrom: item.created_at,
        isActive: true,
        period: `/${item.interval_type}`,
        price: item.monthly_amount / 100,
        id: item.external_plan_id,
        razorPayConfig,
      }
    }),
  ),
)

const handlePaymentSuccess = (response: any) => {
  // Handle successful payment
  console.log('Payment successful:', response)
}

const handlePaymentError = (error: any) => {
  // Handle payment error
  console.error('Payment failed:', error)
}

// Get customer info from profile
const customerInfo = computed(() => ({
  name: `${profile.value?.given_name} ${profile.value?.surname}`.trim(),
  email: profile.value?.email,
  contact: '', // Add contact if available in profile
}))
</script>

<template>
  <div>
    <SettingsCard
      :title="{
        main: 'Payment Settings',
        subtitle: 'Manage your subscription and payment methods',
      }"
    >
      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative rounded-xl overflow-hidden"
          :class="{
            'bg-gray-900 border-2 border-blue-500': profile?.user_plan === plan.name.toLowerCase(),
            'bg-gray-900/80': !plan.isActive && profile?.user_plan !== plan.name.toLowerCase(),
            'bg-gray-900': plan.isActive && profile?.user_plan !== plan.name.toLowerCase(),
          }"
        >
          <!-- Current Plan Badge -->
          <div
            v-if="profile?.user_plan === plan.name.toLowerCase()"
            class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full"
          >
            Current Plan
          </div>

          <div class="p-6 flex flex-col justify-between h-full">
            <!-- Plan Header -->
            <div>
              <h3 class="text-xl font-semibold text-white">{{ plan.name }}</h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold text-white">₹{{ plan.price }}</span>
                <span class="ml-1 text-sm text-gray-400">{{ plan.period }}</span>
              </div>
              <p class="mt-3 text-sm text-gray-400">{{ plan.description }}</p>
            </div>

            <!-- Features List -->
            <ul class="mt-6 space-y-4 flex-grow flex flex-col h-full">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start"
              >
                <Icon
                  name="mdi:check-circle"
                  class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                />
                <span class="text-sm text-gray-300">{{ feature }}</span>
              </li>
            </ul>

            <!-- Action Button -->
            <div class="mt-8">
              <div v-if="plan.isActive">
                <PaymentButton
                  v-if="
                    profile?.user_plan !== plan.name.toLowerCase() ||
                    plan.razorPayConfig?.subscription_status === 'charged'
                  "
                  :plan="{
                    id: plan.id,
                    name: plan.name,
                    description: `Monthly ${plan.name} Plan`,
                    amount: plan.price,
                    subscription_id: plan.razorPayConfig?.subscription_id,
                  }"
                  :customer="customerInfo"
                  button-label="Upgrade Plan"
                  :theme="{ color: '#3B82F6' }"
                  class="w-full"
                  @payment-success="handlePaymentSuccess"
                  @payment-error="handlePaymentError"
                />
                <button
                  v-else
                  class="w-full py-2 text-sm font-medium rounded-md bg-gray-800 text-gray-400 cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>
              <div
                v-else
                class="w-full py-2 px-4 bg-gray-800 text-sm text-gray-400 rounded-md text-center"
              >
                {{ plan.availableFrom }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simplified Payment Methods Section -->
      <!-- <div class="mt-8 border-t border-gray-800 pt-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-white">Payment Methods</h3>
            <p class="text-sm text-gray-400">Manage your saved payment methods</p>
          </div>
          <button
            class="inline-flex items-center px-4 py-2 bg-gray-800 text-sm font-medium text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Icon
              name="mdi:credit-card"
              class="mr-2"
            />
            Manage Methods
          </button>
        </div>
      </div> -->
    </SettingsCard>
  </div>
</template>
