<script setup lang="ts">
const currentUserId = useRoute().params.id

const { adminLinks } = usePages()
</script>

<template>
  <div class="w-full h-screen flex background relative overflow-scroll lg:p-4">
    <BaseSideNav :links="adminLinks" />
    <div class="w-full h-full lg:pb-0 relative flex flex-col rounded-lg overflow-scroll foreground">
      <div class="h-full foreground">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
