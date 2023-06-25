<template>
  <div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
    <div class="p-8 space-y-1 rounded-md shadow-md foreground">
      <h1 class="pb-4 text-4xl font-semibold"> Welcome 👋</h1>
      <h3 class="pb-4 text-xl font-semibold">AstroTribe Is Currently In Closed Alpha</h3>
      <p>
        This means we have limited functionality, navigate around to preview the application The
        good news is that we will be rolling out new features every month!
      </p>
      <p class="font-semibold"> Interested in joining the beta waitlist? </p>
      <NuxtLink
        to="auth/register-interest"
        class="link"
      >
        <UButton color="primary"> Register your interest here. </UButton>
      </NuxtLink>
    </div>
    <div class="p-8 rounded-md shadow-md foreground">
      <h1 class="text-xl font-semibold">Admin</h1>
      <div class="flex flex-wrap gap-2">
        <UButton
          color="primary"
          class="mt-4"
          @click="createVenues"
        >
          Create Venues
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const createVenues = async () => await useAsyncData(() => $fetch('/api/admin/venues/create-many'))
</script>

<style scoped></style>
