<script lang="ts" setup>
import NavTop from '~/components/NavTop.vue'
import TestComponent from '~/components/TestComponent.vue'
</script>

<template>
  <div>
    <NavTop />
    <p>testing</p>
    <PrimeButton> hello world </PrimeButton>
    <PrimeCard class="p-4 bg-red-300" />
    <div>
      <p class="p-4 rounded-md background border border-color text-lg font-bold">
        some content loaded with tailwind styling</p
      >
    </div>
    <TestComponent />
  </div>
</template>

<style></style>
