<!-- components/payments/RazorpayButton.vue -->
<script setup lang="ts">
interface PlanDetails {
  id: string
  external_plan_id: string
  name: string
  description: string
  amount: number
  currency?: string
  interval?: string
  subscription_id?: string
}

interface CustomerInfo {
  name?: string
  email?: string
  contact?: string
}

interface Props {
  plan: PlanDetails
  createSubscription: (plan: Record<string, any>) => Promise<Record<string, any> | null>
  customer?: CustomerInfo
  buttonLabel?: string
  buttonIcon?: string
  theme?: {
    color?: string
    logo?: string
  }
  notes?: Record<string, string>
  handlePaymentSuccess: (response: any) => void
  handlePaymentError: (response: any) => void
}

const toast = useNotification()

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: 'Pay Now',
  buttonIcon: 'pi pi-credit-card',
  theme: () => ({ color: '#4F46E5', logo: '/astronera-logo.jpg' }),
  customer: () => ({}),
  notes: () => ({}),
})

const emit = defineEmits<{
  'payment-success': [response: any]
  'payment-error': [error: any]
  'payment-closed': []
}>()

const { razorpayKey } = useRuntimeConfig()
const loading = ref(false)
const isRazorpayLoaded = ref(false)

const razorpayOptions = reactive({
  key: razorpayKey,
  subscription_id: props.plan.subscription_id,
  subscriptionStartsLater: false,
  amount: props.plan.amount * 100, // Razorpay expects amount in paise
  currency: props.plan.currency || 'INR',
  name: props.plan.name,
  description: props.plan.description,
  image: props.theme.logo,
  handler: function (response: any) {
    props.handlePaymentSuccess(response)
    unloadRazorpay()
  },
  modal: {
    ondismiss: function () {
      emit('payment-closed')
      loading.value = false
      unloadRazorpay()
    },
  },
  prefill: {
    name: props.customer.name,
    email: props.customer.email,
    contact: props.customer.contact,
  },
  capture: true,
  notes: props.notes,
  theme: {
    color: props.theme.color,
  },
})

let rzp: any

// Watch for changes in razorpayOptions and recreate instance if needed
watch(
  () => razorpayOptions,
  (newOptions) => {
    if (isRazorpayLoaded.value) {
      rzp = new (window as any).Razorpay(newOptions)
    }
  },
  { deep: true },
)

const loadRazorpay = async () => {
  // Create a Promise to ensure the script is fully loaded before proceeding
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      isRazorpayLoaded.value = true
      resolve(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      reject(new Error('Razorpay script failed to load'))
    }
    document.head.appendChild(script)
  })

  // Initialize Razorpay after script is loaded
  rzp = new (window as any).Razorpay(razorpayOptions)
}

const unloadRazorpay = () => {
  // Locate the Razorpay script by its src
  const script = document.querySelector(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
  )
  if (script) {
    // Remove the script from the DOM
    script.remove()
    isRazorpayLoaded.value = false
    console.log('Razorpay script removed from DOM')
  }
}

const createSubscription = async () => {
  try {
    const subscription = await props.createSubscription({
      plan_id: props.plan.id,
      external_plan_id: props.plan.external_plan_id,
      total_count: props.plan.interval === 'monthly' ? 360 : 30,
    })

    if (!subscription) {
      console.error('Could not create subscription', subscription)
      toast.error({
        summary: 'Could not create subscription',
        message: 'If the error persists, please contact the administrator',
      })
      return false
    }

    // Check if subscription starts in the future
    if (subscription?.start_at) {
      const start_at = getTimestamp(subscription.start_at)

      if (start_at > Math.floor(Date.now() / 1000)) {
        razorpayOptions.subscriptionStartsLater = true

        // Show user when the subscription will start and be charged
        const startDate = new Date(start_at * 1000)
        toast.success({
          summary: 'Subscription Scheduled',
          message: `Your new subscription will start on ${startDate.toDateString()} and you'll be charged then.`,
        })

        return false // Don't proceed to payment since it's scheduled for later
      }
    }

    razorpayOptions.subscription_id = subscription.external_subscription_id
    return true
  } catch (error) {
    console.error('Error creating subscription:', error)
    toast.error({
      summary: 'Error',
      message: 'Failed to create subscription. Please try again.',
    })
    return false
  }
}

const getTimestamp = (start_at: string) => {
  // Replace space with 'T' to make it ISO 8601-compliant
  const isoString = start_at.replace(' ', 'T')

  // Create a Date object
  const date = new Date(isoString)

  // Convert to Unix timestamp (in seconds)
  return Math.floor(date.getTime() / 1000)
}

const handlePayment = async () => {
  loading.value = true

  try {
    if (!razorpayOptions.subscription_id) {
      const shouldProceedToPayment = await createSubscription()

      if (!shouldProceedToPayment) {
        loading.value = false
        return // Subscription was scheduled for later, no immediate payment needed
      }
    }

    // Only proceed with Razorpay if subscription should start immediately
    await loadRazorpay()
    rzp.open()
  } catch (error: any) {
    props.handlePaymentError(error)
    loading.value = false
  }
}

onUnmounted(() => {
  loading.value = false
  unloadRazorpay()
})
</script>

<template>
  <PrimeButton
    :label="buttonLabel"
    :icon="buttonIcon"
    :loading="loading"
    @click="handlePayment"
  />
</template>
