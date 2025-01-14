<script setup="ts">
const { fetchPlans, togglePlan, plans } = usePlans()

fetchPlans()

const handleTogglePlan = (planId, isActive) => togglePlan(planId, isActive)
</script>

<template>
  <div> Plans </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    <div
      v-for="plan in plans"
      :key="plan.name"
      class="relative rounded-xl overflow-hidden"
      :class="{
        'bg-gray-900 border-2 border-blue-500': profile?.user_plan === plan.name.toLowerCase(),
        'bg-gray-900/80': !plan.isActive && profile?.user_plan !== plan.name.toLowerCase(),
        'bg-gray-900': plan.isActive && profile?.user_plan !== plan.name.toLowerCase(),
      }"
    >
      <div class="p-6 flex flex-col justify-between h-full">
        <!-- Plan Header -->
        <div>
          <h3 class="text-xl font-semibold text-white">{{ plan.name }}</h3>
          <div class="mt-2 flex items-baseline">
            <span class="text-3xl font-bold text-white">₹{{ plan.price }}</span>
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
          <button @click="handleTogglePlan(plan.id, plan.isActive)">{{
            plan.isActive ? 'Deactivate' : 'Activate'
          }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
