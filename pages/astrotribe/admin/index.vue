<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
  middleware: 'is-admin'
})

const urlTest = ref('https://astrotribe-production.up.railway.app/api')
const outputData = ref('')
const testUrl = async () => {
  const data = await $fetch(urlTest.value)
  console.log(data)
  outputData.value = JSON.stringify(data, null, 2)
}

const reset = () => {
  outputData.value = ''
}
</script>

<template>
  <div class="relative h-full max-h-full">
    <div class="flex flex-col gap-8">
      <div class="flex gap-4 p-4">
        <PrimeButton @click="testUrl"> Test API </PrimeButton>
        <PrimeInputText v-model="urlTest" />
        <PrimeButton @click="reset"> Clear </PrimeButton>
      </div>
      <p> {{ outputData }}</p>
    </div>
    <AdminDatabaseMetrics />
    <AdminServerJobs />
  </div>
</template>

<style scoped></style>
