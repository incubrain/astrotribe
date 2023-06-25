<template>
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
</template>

<script setup lang="ts">

const createVenues = async () => await useAsyncData(() => $fetch('/api/admin/venues/create-many'))

</script>

<style scoped></style>
