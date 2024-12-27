<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Upload',
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- <IBUpload
      name="user-images"
      url="/api/users/bulk-upload"
      accept="image/*"
      :maxFileSize="50000000"
      :multiple="true"
    /> -->

    <Upload />
  </div>
</template>

<style scoped></style>
