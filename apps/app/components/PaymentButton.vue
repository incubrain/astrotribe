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

const config = useRuntimeConfig()
const loading = ref(false)
const isRazorpayLoaded = ref(false)

const razorpayOptions = computed(() => ({
  key: config.public.razorpayKey || 'rzp_test_lV0OE0NDIg6Hr6',
  subscription_id: props.plan.subscription_id,
  amount: props.plan.amount * 100, // Razorpay expects amount in paise
  currency: props.plan.currency || 'INR',
  name: props.plan.name,
  description: props.plan.description,
  image: props.theme.logo,
  handler: function (response: any) {
    emit('payment-success', response)
  },
  modal: {
    ondismiss: function () {
      emit('payment-closed')
      loading.value = false
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
  if (isRazorpayLoaded.value) return

  // Load Razorpay script dynamically when the user clicks the button
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true
  script.onload = () => {
    isRazorpayLoaded.value = true
    rzp = new (window as any).Razorpay(razorpayOptions.value)
  }
  document.head.appendChild(script)
}

const createSubscription = async () => {
  const subscription = await razorpay.createOrder(props.plan.id, props.plan.external_plan_id)

  razorpayOptions.value.subscription_id = subscription.id
  rzp = new (window as any).Razorpay(razorpayOptions.value)
}

const handlePayment = async () => {
  if (!razorpayOptions.value.subscription_id) await createSubscription()

  if (!isRazorpayLoaded.value) {
    await loadRazorpay()
  }

  try {
    loading.value = true
    rzp.open()
  } catch (error: any) {
    emit('payment-error', error)
    loading.value = false
  }
}
</script>

<template>
  <PrimeButton
    :label="buttonLabel"
    :icon="buttonIcon"
    :loading="loading"
    @click="handlePayment"
  />
</template>
