<template>
  <div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
    <div class="p-8 rounded-md background border border-color">
      <h1 class="pb-4 text-4xl font-semibold">
        Welcome 👋
      </h1>
      <h3 class="pb-4 text-xl font-semibold">
        AstroTribe Is Currently In Open Alpha
      </h3>
      <p>
        This means we have limited functionality, navigate around to preview the application The
        good news is that we will be rolling out new features every month!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  name: 'AstroTribe',
  layout: 'app'
})

</script>

<style scoped></style>
