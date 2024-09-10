<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Upload',
  middleware: 'is-admin',
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- <IBUpload
      name="user-images"
      url="/api/admin/users/bulk-upload"
      accept="image/*"
      :maxFileSize="50000000"
      :multiple="true"
    /> -->

    <AdminUpload />
  </div>
</template>

<style scoped></style>
