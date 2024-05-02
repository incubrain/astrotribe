<script setup lang="ts">
definePageMeta({
  name: 'AstroTribe',
  layout: 'app'
})

const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)
</script>

<template>
  <div class="grid w-full grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3">
    <div class="p-8 rounded-md background border border-color">
      <h1 class="pb-4 text-4xl font-semibold"> Welcome {{ profile?.given_name ?? '' }} 👋 </h1>
      <h3 class="pb-4 text-xl font-semibold"> AstroTribe Is Currently In Open Alpha </h3>
      <p>
        This means we have limited functionality, navigate around to preview the application The
        good news is that we will be rolling out new features every month!
      </p>
    </div>
    <PrimeCard>
      <template #header>
        <h3 class="p-4 text-2xl font-semibold"> News </h3>
      </template>
      <template #content>
        <p>some information about what we're providing</p>
      </template>
      <template #footer>
        <div class="w-full flex justify-end">
          <PrimeButton> click me </PrimeButton>
        </div>
      </template>
    </PrimeCard>
    <PrimeCard>
      <template #header>
        <h3 class="p-4 text-2xl font-semibold"> News </h3>
      </template>
      <template #content>
        <p>some information about what we're providing</p>
      </template>
      <template #footer>
        <div class="w-full flex justify-end">
          <PrimeButton> click me </PrimeButton>
        </div>
      </template>
    </PrimeCard>
    <BaseSidebar />
  </div>
</template>

<style scoped></style>
