<script setup="ts">
const { fetchPlans, syncPlans, togglePlan, plans } = usePlans()

fetchPlans()

const handleTogglePlan = (planId, isActive) => togglePlan(planId, isActive)
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Plans</h1>
    <PrimeButton
      @click="syncPlans"
      class="flex items-center justify-between gap-2"
    >
      <span>Sync with Razorpay</span>
      <Icon
        name="mdi:sync"
        size="24px"
      />
    </PrimeButton>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
    <div
      v-for="plan in plans"
      :key="plan.name"
      class="relative rounded-xl overflow-hidden"
    >
      <div class="p-6 flex flex-col justify-between h-full">
        <!-- Plan Header -->
        <div>
          <h3 class="text-xl font-semibold text-white">{{ plan.name }}</h3>
          <div class="mt-2 flex items-baseline">
            <span class="text-3xl font-bold text-white">₹{{ plan.monthly_amount.d[0] / 100 }}</span>
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
          <button
            :class="`rounded bg-${plan.is_active ? 'red' : 'green'}-500 p-2`"
            @click="handleTogglePlan(plan.id, plan.is_active)"
            >{{ plan.is_active ? 'Deactivate' : 'Activate' }}</button
          >
        </div>
      </div>
    </div>
  </div>
</template>
