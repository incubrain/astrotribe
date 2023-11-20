<template>
  <div class="space-y-4 xl:space-y-8">
    <div class="space-x-4 xl:space-x-8">
      <UButton @click="seedRoles"> Seed Roles </UButton>
      <UButton @click="seedUsers"> Seed Users </UButton>
      <UButton @click="testFunction('newsScraper')"> Test Function </UButton>
    </div>
    <AdminSeedDatabase />
    <AdminTesting />
    <!-- <UTable
      :rows="rows"
      :columns="columns"
      @select="select"
    /> -->
  </div>
</template>

<script setup lang="ts">
const seedRoles = async () => {
  await useFetch('/api/admin/create/roles')
}

const seedUsers = async () => {
  await useFetch('/api/admin/create/many-users')
}

const testFunction = async (name: string) => {
  await useFetch('/api/admin/testing', {
    query: {
      functionName: name
    }
  })
}

definePageMeta({ name: 'Admin', layout: 'app' })
</script>
