<!-- components/settings/PaymentSection.vue -->
<script setup lang="ts">
import confetti from 'canvas-confetti'
import { onMounted } from 'vue'

const currentUser = useCurrentUser()
const loading = ref(true)
const confirmingSubscription = ref(false)

const { profile } = storeToRefs(currentUser)

const razorpay = usePayments()
const toast = useNotification()
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
    createdSubscription(event.data)
  }

  if (event?.type === 'updated') {
    updateSubscription(event.data)
  }

  await currentUser.refreshUserStore()
})

const createdSubscription = (subscription) => {
  confirmingSubscription.value = false
  const existingIndex = subscriptions.value?.findIndex((item) => item.id === subscription.id) ?? -1

  if (existingIndex === -1) {
    // Add new subscription to the beginning of the array
    subscriptions.value = subscriptions.value?.length
      ? [subscription, ...subscriptions.value]
      : [subscription]
  } else {
    // Replace existing subscription
    subscriptions.value[existingIndex] = subscription
  }
}

const updateSubscription = (subscription) => {
  confirmingSubscription.value = false

  subscriptions.value = subscriptions.value.map((sub) => {
    if (sub.id === subscription.id) {
      return subscription
    }
    return sub
  })

  // Handle different subscription statuses
  if (['active', 'resumed', 'completed'].includes(subscription.status)) {
    triggerConfetti()
    toast.success({
      summary: 'Congratulations',
      message: 'Your subscription is now active',
    })
  } else if (subscription.status === 'created' && subscription.start_at) {
    const startDate = new Date(subscription.start_at)
    if (startDate > new Date()) {
      toast.info({
        summary: 'Subscription Scheduled',
        message: `Your subscription will activate on ${startDate.toDateString()}`,
      })
    }
  }
}

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
  features: {
    values: [
      'Basic project access',
      'Community support',
      '2 team members',
      '1GB storage',
      'Basic analytics',
    ],
  },
  razorPayConfig: {
    isActive: true,
    buttonLabel: 'Current Plan',
  },
  isActive: true,
  availableFrom: null,
}

const plans = computed<PlanConfig>(() => {
  if (!plansData.value?.length) return null

  return [
    // Free plan logic...
    (!subscriptions.value?.length ||
      !subscriptions.value.some((subscription) => activeStates.includes(subscription.status))) &&
      freePlan,
  ]
    .filter((plan) => plan)
    .concat(
      plansData.value.map((item: any) => {
        let isActive = false
        let buttonLabel = `Subscribe to ${item.name} (${item.interval_type})`
        let razorPayConfig = {
          isActive,
          buttonLabel,
          subscription_id: null,
          subscription_status: null,
        }

        const subscription = subscriptions.value?.find((sub) => sub.plan_id === item.id)

        if (subscription && subscription.plan_id === item.id) {
          const period = item.interval_type.charAt(0).toUpperCase() + item.interval_type.slice(1)

          switch (subscription.status) {
            case 'created':
              const start_at = new Date(subscription.start_at).getTime()
              if (start_at > Date.now()) {
                isActive = true
                buttonLabel = `Scheduled to start ${new Date(start_at).toDateString()}`
              } else {
                buttonLabel = `Activate ${period} Plan`
              }
              break
            case 'active':
            case 'resumed':
            case 'completed':
              isActive = true
              buttonLabel = `Current Plan (${period})`

              // Check if there's another subscription scheduled after this one
              const futureSubscription = subscriptions.value?.find(
                (sub) =>
                  sub.plan_id !== item.id &&
                  sub.status === 'created' &&
                  new Date(sub.start_at) >
                    new Date(subscription.current_end || subscription.end_at),
              )

              if (futureSubscription) {
                buttonLabel += ` - Next: ${futureSubscription.plan.name}`
              }
              break
            case 'charged':
              buttonLabel = `Renew Plan (${period})`
              break
            case 'pending':
              isActive = true
              buttonLabel = 'Please Update Payment Method'
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
            item.interval_type === 'monthly' ? item.monthly_amount / 100 : item.annual_amount / 100,
          razorPayConfig,
        }
      }),
    )
    .reduce((acc, plan) => {
      if (!acc[plan.name]) {
        acc[plan.name] = []
      }
      acc[plan.name].push(plan)
      return acc
    }, {})
})

const handlePaymentSuccess = async (response: any) => {
  // Handle successful payment
  confirmingSubscription.value = true

  if (!response || !response.razorpay_payment_id || !response.razorpay_subscription_id) {
    console.error('Something went wrong: ', response)
    toast.error({
      summary: 'Could not create subscription',
      message: 'Please contact the administrator',
    })
    confirmingSubscription.value = false
    return
  }

  const { razorpay_payment_id: paymentId, razorpay_subscription_id: subscriptionId } = response
  const { error } = await razorpay.verifyPayment(paymentId, subscriptionId)

  if (error) {
    confirmingSubscription.value = false
    toast.error({
      summary: 'Could not create subscription',
      message: 'Please contact the administrator',
    })
    return
  }

  toast.success({ summary: 'Payment Successful', message: 'Your subscription is being activated' })
}

const handlePaymentError = (error: any) => {
  // Handle payment error
  console.error('Payment failed:', error)

  toast.error({
    summary: 'Payment Failure',
    message: 'Please try again or a different payment method',
  })
}

const getDiscountedPrice = (plan) => {
  const offer = plan.offers[0]

  if (offer.already_discounted) {
    let oldPrice
    if (offer.discount_type == 'percentage') {
      oldPrice = plan.price / (1 - offer.discount.d[0] / 100)
    } else {
      oldPrice = plan.price + offer.discount.d[0]
    }
    return { oldPrice, newPrice: plan.price }
  }
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
  } catch (error: any) {
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
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
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
                :key="plan.id"
                class="mt-2 flex flex-col items-baseline"
              >
                <div>
                  <span class="text-3xl font-bold text-white">₹{{ plan.price }}</span>
                  <span class="ml-1 text-sm text-gray-400">/{{ plan.period }}</span>
                </div>
                <div v-if="!!plan?.offers?.length">
                  <span class="line-through">₹{{ getDiscountedPrice(plan)?.oldPrice }}/yearly</span>
                </div>
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
              :key="plan.id"
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
      v-if="loading"
      class="flex items-center justify-center"
    >
      <PrimeProgressSpinner />
    </div>
    <PrimeDialog
      :closable="false"
      :draggable="false"
      v-model:visible="confirmingSubscription"
      modal
      class="bg-white"
    >
      <template #header>
        <div class="flex flex-col justify-center items-center gap-4">
          <h2 class="text-black">Confirming Subscription</h2>
          <PrimeProgressSpinner />
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>
