<template>
  <div class="w-full h-full relative overflow-hidden flex flex-col p-4 xl:p-8">
    <div class="h-full flex-grow">

    </div>
    <AdminChatMessageBar class="flex-shrink" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'A-Chat',
  middleware: 'is-admin'
})
</script>

<style scoped></style>
