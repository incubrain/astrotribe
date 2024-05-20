<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Manage-Users',
  layout: 'app',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Upload User Images</h2>
    <PrimeInlineMessage severity="info">
      File names should match users given_name and surname in the database. eg. john-doe.jpg
    </PrimeInlineMessage>
    <BaseUpload
      name="user-images"
      url="/api/admin/users/bulk-upload"
      accept="image/*"
      :maxFileSize="50000000"
      :multiple="true"
    />
  </div>
</template>

<style scoped></style>
