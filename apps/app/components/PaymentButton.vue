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
  customer?: CustomerInfo
  buttonLabel?: string
  buttonIcon?: string
  theme?: {
    color?: string
    logo?: string
  }
  notes?: Record<string, string>
}

const razorpay = usePayments('razorpay')
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

const razorpayOptions = computed(() => ({
  key: razorpayKey,
  subscription_id: props.plan.subscription_id,
  subscriptionStartsLater: false,
  amount: props.plan.amount * 100, // Razorpay expects amount in paise
  currency: props.plan.currency || 'INR',
  name: props.plan.name,
  description: props.plan.description,
  image: props.theme.logo,
  handler: function (response: any) {
    emit('payment-success', response)
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
}))

let rzp: any

// Watch for changes in razorpayOptions and recreate instance if needed
watch(
  () => razorpayOptions.value,
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
  rzp = new (window as any).Razorpay(razorpayOptions.value)
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
  const subscription = await razorpay.createOrder({
    plan_id: props.plan.id,
    external_plan_id: props.plan.external_plan_id,
    total_count: props.plan.interval === 'monthly' ? 360 : 30,
  })

  if (subscription.start_at > Date.now() / 1000) {
    razorpayOptions.value.subscriptionStartsLater = true
  }
  razorpayOptions.value.subscription_id = subscription.id
}

const handlePayment = async () => {
  loading.value = true
  if (!razorpayOptions.value.subscription_id) await createSubscription()

  if (razorpayOptions.value.subscriptionStartsLater) {
    toast.success({
      summary: 'Subscription Created',
      message:
        'Your new subscription will start and will be charged at the end of your current subscription',
    })
    return
  }

  await loadRazorpay()

  try {
    rzp.open()
  } catch (error: any) {
    emit('payment-error', error)
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
