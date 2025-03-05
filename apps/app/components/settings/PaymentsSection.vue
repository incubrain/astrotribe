<!-- components/settings/PaymentSection.vue -->
<script setup lang="ts">
import confetti from 'canvas-confetti'
import { onMounted } from 'vue'

const currentUser = useCurrentUser()
const loading = ref(true)

const { profile } = storeToRefs(currentUser)

const razorpay = usePayments('razorpay')
const { lastEvent, isConnected } = useEvents()
const subscriptions = ref([])

const activeStates = ['active', 'completed', 'pending', 'charged']

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 150,
    origin: { x: 0.5, y: 0.5 },
  })
}

watch(lastEvent, async (event) => {
  if (event?.module !== 'subscription') return

  if (event?.type === 'created') {
    if (!subscriptions.value.some((item) => item.id === event.data.id)) {
      const subscription = event.data
      subscriptions.value = subscriptions.value?.length
        ? [subscription.data, ...subscriptions.value]
        : [subscription.data]
    } else {
      subscriptions.value = subscriptions.value.map((sub) => {
        if (sub.id === event.data.id) {
          return event.data
        }
        return sub
      })
    }
  }

  if (event?.type === 'updated') {
    subscriptions.value = subscriptions.value.map((sub) => {
      if (sub.id === event.data.id) {
        return event.data
      }
      return sub
    })

    if (['active', 'resumed', 'completed'].includes(event.data.status)) {
      triggerConfetti()
    }
  }
})

const plansData = ref([])

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

const freePlan = {
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
  razorPayConfig: {
    isActive: true,
    buttonLabel: `Current Plan`,
  },
  isActive: true,
  availableFrom: null,
}

const plans = computed<PlanConfig>(() =>
  plansData.value?.length
    ? [
        (!subscriptions.value?.length ||
          !subscriptions.value.some((subscription) =>
            activeStates.includes(subscription.status),
          )) &&
          freePlan,
      ]
        .filter((plan) => plan)
        .concat(
          plansData.value.map((item: any) => {
            let isActive = false,
              buttonLabel = `Subscribe to ${item.name} (${item.interval_type})`
            let razorPayConfig = {
              isActive,
              buttonLabel,
              subscription_id: null,
              subscription_status: null,
            }

            const subscription = subscriptions.value?.find((sub) => sub.plan_id === item.id)

            if (subscription && subscription.plan_id === item.id) {
              const period =
                item.interval_type.charAt(0).toUpperCase() + item.interval_type.slice(1)
              switch (subscription.status) {
                case 'created':
                  const start_at = new Date(subscription.start_at).getTime()
                  if (start_at > Date.now()) {
                    isActive = true
                    buttonLabel = `(${period}) Plan starts on ${new Date(start_at).toDateString()}`
                  }
                  break
                case 'active':
                case 'resumed':
                case 'completed':
                  isActive = true
                  buttonLabel = `Current Plan (${period})`
                  break
                case 'charged':
                  buttonLabel = `Renew Plan (${period})`
                  break
                case 'pending':
                  isActive = true
                  buttonLabel = `Please Update Payment Method`
                  break
                default:
                  buttonLabel = `Subscribe to ${item.name} (${period})`
              }

              razorPayConfig = {
                subscription_id: subscription.external_subscription_id,
                subscription_status: subscription.status,
                isActive,
                buttonLabel,
              }
            }

            return {
              ...item,
              availableFrom: item.created_at,
              isActive: item.is_active,
              period: item.interval_type,
              price:
                item.interval_type === 'monthly'
                  ? item.monthly_amount.d / 100
                  : item.annual_amount.d / 100,
              razorPayConfig,
            }
          }),
        )
        .reduce((acc, plan) => {
          if (!acc[plan.name]) {
            // Initialize the group if not already present
            acc[plan.name] = []
          }
          // Add the current plan to the appropriate group
          acc[plan.name].push(plan)
          return acc
        }, {})
    : null,
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

onMounted(async () => {
  await currentUser.refreshUserStore()
  try {
    subscriptions.value = await razorpay.fetchSubscriptions({
      status: { notIn: ['cancelled', 'expired'] },
    })
    plansData.value = await razorpay.fetchPlans()
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <SettingsCard
      :class="{
        'opacity-50': loading,
        'pointer-events': loading ? 'none' : 'auto',
      }"
      :title="{
        main: 'Payment Settings',
        subtitle: 'Manage your subscription and payment methods',
      }"
    >
      <!-- Pricing Cards Grid -->
      <div
        v-if="plans"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
      >
        <div
          v-for="[name, allPlans] in Object.entries(plans)"
          :key="name"
          class="relative rounded-xl overflow-hidden"
          :class="{
            'bg-gray-900 border-2 border-blue-500': profile?.user_plan === name.toLowerCase(),
            'bg-gray-900/80': !allPlans[0].isActive && profile?.user_plan !== name.toLowerCase(),
            'bg-gray-900': allPlans[0].isActive && profile?.user_plan !== name.toLowerCase(),
          }"
        >
          <!-- Current Plan Badge -->
          <div
            v-if="profile?.user_plan === name.toLowerCase()"
            class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full"
          >
            Current Plan
          </div>

          <div class="p-6 flex flex-col justify-between h-full">
            <!-- Plan Header -->
            <div>
              <h3 class="text-xl font-semibold text-white">{{ name }}</h3>
              <div
                v-for="plan in allPlans"
                class="mt-2 flex items-baseline"
              >
                <span class="text-3xl font-bold text-white">₹{{ plan.price }}</span>
                <span class="ml-1 text-sm text-gray-400">/{{ plan.period }}</span>
              </div>
              <p class="mt-3 text-sm text-gray-400">{{ allPlans[0].description }}</p>
            </div>

            <!-- Features List -->
            <ul class="mt-6 space-y-4 flex-grow flex flex-col h-full">
              <li
                v-for="feature in allPlans[0].features.values"
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
            <div
              v-for="plan in allPlans"
              class="mt-4"
            >
              <div v-if="plan.isActive">
                <PaymentButton
                  v-if="
                    !plan.razorPayConfig?.isActive &&
                    !['charged', 'expired', 'halted', 'pending'].includes(
                      plan.razorPayConfig?.subscription_status,
                    )
                  "
                  :plan="{
                    id: plan.id,
                    external_plan_id: plan.external_plan_id,
                    name: plan.name,
                    description: `Monthly ${plan.name} Plan`,
                    amount: plan.price,
                    subscription_id: plan.razorPayConfig?.subscription_id,
                  }"
                  :customer="customerInfo"
                  :button-label="plan.razorPayConfig?.buttonLabel"
                  :theme="{ color: '#3B82F6' }"
                  class="w-full"
                  @payment-success="handlePaymentSuccess"
                  @payment-error="handlePaymentError"
                />
                <button
                  v-else
                  class="w-full py-2 text-sm font-medium rounded-md bg-gray-800 text-gray-400 cursor-not-allowed"
                >
                  {{ plan.razorPayConfig?.buttonLabel }}
                </button>
              </div>
              <div
                v-else
                class="w-full py-2 px-4 bg-gray-800 text-sm text-gray-400 rounded-md text-center"
              >
                {{ plan.availableFrom ?? 'Currently unavailable' }}
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
    <div
      class="flex items-center justify-center"
      v-if="loading"
    >
      <PrimeProgressSpinner />
    </div>
  </div>
</template>
