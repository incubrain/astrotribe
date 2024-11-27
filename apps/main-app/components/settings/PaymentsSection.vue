<!-- components/settings/PaymentSection.vue -->
<script setup lang="ts">
import { usePayments } from '~/composables/usePayments'

const { isLoading, subscription, initializePayment, createOrder, verifyPayment } =
  usePayments('razorpay')

useHead({
  script: [
    {
      src: 'https://checkout.razorpay.com/v1/checkout.js',
      defer: true,
    },
  ],
})
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Payment Settings',
      subtitle: 'Manage your subscription and payment methods',
    }"
  >
    <div class="space-y-6">
      <div v-if="subscription">
        <h3 class="text-lg font-medium">Current Subscription</h3>
        <div class="mt-2 text-gray-400">
          {{ subscription.plan_name }}
        </div>
      </div>

      <div class="flex gap-4">
        <PaymentButton />
        <PrimeButton
          :loading="isLoading"
          @click="() => initializePayment()"
        >
          Manage Subscription
        </PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
