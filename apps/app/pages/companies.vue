<script setup lang="ts">
definePageMeta({ name: 'Companies' })

const { profile } = useCurrentUser()

const isUserBasic = profile.user_plan === 'free'
const showDialog = ref(isUserBasic)

const { store, loadMore } = useSelectData('companies', {
  orderBy: { column: 'name', ascending: true },
  pagination: {
    page: 1,
    limit: 20,
  },
  initialFetch: true,
  storeKey: 'companies',
})

const handleScroll = () => {
  if (!isUserBasic) loadMore()
}

const { items: companies } = storeToRefs(store)
</script>

<template>
  <div :class="{ 'blur-sm pointer-events-none': isUserBasic }">
    <Transition
      name="fade"
      mode="out-in"
    >
      <IBInfiniteScroll
        :threshold="1400"
        @update:scroll-end="handleScroll"
      >
        <CompaniesTable :companies="companies" />
      </IBInfiniteScroll>
    </Transition>
  </div>
  <PrimeDialog
    v-model:visible="showDialog"
    :modal="true"
    header="🚀 Upgrade Your Plan"
    :style="{ width: '30vw', borderRadius: '12px' }"
  >
    <div class="flex flex-col items-center gap-4 p-6 text-center">
      <!-- Upgrade Icon -->
      <Icon
        name="mdi:crown"
        size="48px"
        class="text-yellow-500"
      />

      <!-- Upgrade Message -->
      <h3 class="text-lg font-semibold text-white"> Unlock Premium Features! </h3>
      <p class="text-white text-sm">
        Upgrade your plan to access all companies and premium insights.
      </p>

      <!-- Buttons -->
      <div class="flex gap-3 mt-4">
        <NuxtLink to="/settings/payments">
          <PrimeButton
            severity="success"
            class="px-6 py-2 flex items-center gap-2"
          >
            <Icon
              name="mdi:star"
              size="20px"
              class="text-yellow-400"
            />
            Upgrade Now
          </PrimeButton>
        </NuxtLink>
        <PrimeButton
          severity="danger"
          class="px-6 py-2"
        >
          Cancel
        </PrimeButton>
      </div>
    </div>
  </PrimeDialog>
</template>
