<script setup lang="ts">
import { ref } from 'vue'

const { isLoading, error, initializePayment, createOrder, verifyPayment, fetchSubscription }
  = usePayments('razorpay')

const result = ref(null as any)

const handleCreateOrder = async () => {
  result.value = await createOrder('plan_OmmnufyFh3id2P')
}

const handleInitializePayment = async () => {
  const order = await createOrder('plan_OmmnufyFh3id2P')
  if (order) {
    await initializePayment({
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: handleVerifyPayment,
    })
  }
}

const handleVerifyPayment = async (response: any) => {
  result.value = await verifyPayment(response)
}

const handleFetchSubscription = async () => {
  result.value = await fetchSubscription()
}

useHead({
  script: [
    {
      src: 'https://checkout.razorpay.com/v1/checkout.js',
      defer: true,
    },
  ],
})

definePageMeta({
  layoutTransition: false,
  name: 'Payments',
  layout: 'app-settings',
})
</script>

<template>
  <UserSettingsCard
    :title="{
      main: 'Payment Settings',
      subtitle: 'Manage your subscription and payment options',
    }"
  >
    <div class="flex gap-4">
      <PrimeButton
        :loading="isLoading"
        @click="handleCreateOrder"
      >
        Create Order
      </PrimeButton>
      <PaymentButton />
      <PrimeButton
        :loading="isLoading"
        @click="handleInitializePayment"
      >
        Initialize Payment
      </PrimeButton>
      <PrimeButton
        :loading="isLoading"
        @click="handleVerifyPayment"
      >
        Verify Payment
      </PrimeButton>
      <PrimeButton
        :loading="isLoading"
        @click="handleFetchSubscription"
      >
        Fetch Subscription
      </PrimeButton>
    </div>

    <div
      v-if="error"
      class="mt-4 text-red-500"
    >
      {{ error }}
    </div>

    <div
      v-if="result"
      class="mt-4"
    >
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </UserSettingsCard>
</template>
