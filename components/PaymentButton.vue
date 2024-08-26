<template>
  <div class="card background rounded-lg p-4 shadow-lg">
    <h2 class="mb-4 text-2xl font-bold">Monthly Test Plan</h2>
    <div class="relative h-32 w-32 overflow-hidden rounded-full bg-white p-2">
      <NuxtImg
        src="/astronera-logo.jpg"
        alt="Acme Corp Logo"
        class="h-full w-full"
      />
    </div>
    <p class="mb-4">Subscribe to our monthly plan for exclusive benefits!</p>
    <PrimeButton
      label="Pay Now"
      icon="pi pi-credit-card"
      @click="handlePayment"
      :loading="loading"
      :disabled="!isRazorpayLoaded"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const loading = ref(false)
const isRazorpayLoaded = ref(false)

const razorpayOptions = {
  key: 'rzp_test_lV0OE0NDIg6Hr6',
  subscription_id: 'sub_OmnXoFCi6bQSlj',
  name: 'Professional',
  description: 'Monthly Professional Plan',
  image: '/astronera-logo.jpg',
  handler: function (response: any) {
    console.log('Payment ID:', response.razorpay_payment_id)
    console.log('Subscription ID:', response.razorpay_subscription_id)
    console.log('Signature:', response.razorpay_signature)
    // Here you can add logic to verify the payment on your server
  },
  prefill: {
    name: 'Gaurav Kumar',
    email: 'gaurav.kumar@example.com',
    contact: '+919876543210'
  },
  notes: {
    note_key_1: 'Tea. Earl Grey. Hot',
    note_key_2: 'Make it so.'
  },
  theme: {
    color: '#F37254'
  }
}

let rzp: any

useHead({
  script: [
    {
      src: 'https://checkout.razorpay.com/v1/checkout.js',
      async: true,
      onload: () => {
        isRazorpayLoaded.value = true
        rzp = new (window as any).Razorpay(razorpayOptions)
      }
    }
  ]
})

const handlePayment = () => {
  if (!isRazorpayLoaded.value) {
    console.error('Razorpay is not loaded yet')
    return
  }
  loading.value = true
  rzp.open()
  loading.value = false
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
