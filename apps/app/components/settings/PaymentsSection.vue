<!-- components/settings/PaymentSection.vue -->
<script setup lang="ts">
import confetti from 'canvas-confetti'
import { onMounted } from 'vue'

const currentUser = useCurrentUser()
const loader = ref<Record<string, any>>({ loading: false, message: null })
const toggleLoader = (message?: string): void => {
  if (message) {
    loader.value = { loading: true, message }
  } else {
    loader.value = { loading: false, message: null }
  }
}

const { getSubscriptions, updateSubscription, subscriptions } = useSubscriptions(toggleLoader)
const { getPlans, getFormattedPlans, getDiscountedPrice } = usePlans(subscriptions)
const { handlePaymentSuccess, handlePaymentError } = usePayments(toggleLoader)

const confirmingPayment = ref(false)
const plansLoaded = ref(false)
const plans = computed(() => {
  if (!plansLoaded.value) return null
  return getFormattedPlans()?.value || null
})

const selectedPlan = ref()

const { profile } = storeToRefs(currentUser)

const { lastEvent } = useEvents()

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 150,
    origin: { x: 0.5, y: 0.5 },
  })
}

watch(lastEvent, async (event) => {
  if (event?.module === 'subscription') {
    const subscriptionActivated = updateSubscription(event.data.subscription || event.data)
    toggleLoader()
    confirmingPayment.value = false
    subscriptionActivated && triggerConfetti()
  }

  await currentUser.refreshUserStore()
})

// Get customer info from profile
const customerInfo = computed(() => ({
  name: `${profile.value?.given_name} ${profile.value?.surname}`.trim(),
  email: profile.value?.email,
  contact: '', // Add contact if available in profile
}))

onMounted(async () => {
  try {
    toggleLoader('Getting Plans')
    await currentUser.refreshUserStore()
    await getSubscriptions()
    await getPlans()
    plansLoaded.value = true
  } catch (error: any) {
  } finally {
    toggleLoader()
  }
})
</script>

<template>
  <div>
    <SettingsCard
      :title="{
        main: 'Payment Settings',
        subtitle: 'Manage your subscription and payment methods',
      }"
    >
      <div class="relative h-full">
        <!-- Loader -->
        <div
          v-if="loader.loading"
          class="absolute left-[50%] z-10 top-[25%] flex flex-col items-center justify-center"
        >
          <PrimeProgressSpinner />
          <h2>{{ loader.message }}</h2>
        </div>
        <!-- Pricing Cards Grid -->
        <div
          :class="{
            'opacity-40': loader.loading,
            'pointer-events': loader.loading ? 'none' : 'auto',
          }"
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
                    <span class="line-through"
                      >₹{{ getDiscountedPrice(plan)?.oldPrice }}/yearly</span
                    >
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
                  <button
                    v-if="
                      !plan.razorPayConfig?.isActive &&
                      !['charged', 'expired', 'halted', 'pending'].includes(
                        plan.razorPayConfig?.subscription_status,
                      )
                    "
                    @click="((selectedPlan = plan), (confirmingPayment = true))"
                    class="w-full bg-[#3B82F6] text-white p-3 rounded"
                    >{{ plan.razorPayConfig?.buttonLabel }}</button
                  >
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
      </div>
    </SettingsCard>
    <PrimeDialog
      :draggable="false"
      :closable="true"
      :dismissable-mask="true"
      v-model:visible="confirmingPayment"
      modal
      :pt="{
        closeButton: 'text-white hover:text-primary-300',
        header: 'bg-primary-900 border-b border-primary-700',
        content: 'bg-primary-900 p-0',
      }"
      header="Confirm Subscription"
    >
      <template
        v-if="selectedPlan"
        #header
      >
        <div class="flex flex-col">
          <PaymentButton
            :plan="{
              id: selectedPlan.id,
              external_plan_id: selectedPlan.external_plan_id,
              name: selectedPlan.name,
              description: `Monthly ${selectedPlan.name} Plan`,
              amount: selectedPlan.price,
              subscription_id: selectedPlan.razorPayConfig?.subscription_id,
            }"
            :customer="customerInfo"
            button-label="Confirm Payment"
            :theme="{ color: '#3B82F6' }"
            class="w-full"
            :toggleLoader="toggleLoader"
            :handle-payment-success="handlePaymentSuccess"
            :handle-payment-error="handlePaymentError"
            @click="($emit('confirm'), (confirmingPayment = false))"
          />
          <PrimeButton
            label="Cancel"
            class="p-button-text"
            @click="confirmingPayment = false"
          />
        </div>
      </template>
      <template
        v-else
        #header
      >
        <p
          >Something went wrong. Please try again and if the error persists, please contact the
          administrator</p
        >
        <PrimeButton
          label="Close"
          class="p-button-text"
          @click="$emit('cancel')"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
