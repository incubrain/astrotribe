<template>
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-xl font-semibold">Bulk Upload User Images</h2>
    <div class="flex flex-col w-auto gap-4">
      <PrimeInlineMessage severity="info">
        File names should match users given_name and surname in the database. eg. john-doe.jpg
      </PrimeInlineMessage>
      <PrimeInlineMessage severity="warn">
        Only Avatar images for now.
      </PrimeInlineMessage>
    </div>
    <BaseUpload
      name="user-images"
      url="/api/admin/users/bulk-upload"
      accept="image/*"
      :maxFileSize="50000000"
      :multiple="true"
    />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layoutTransition: false,
  name: 'Upload',
  middleware: 'is-admin'
})
</script>

<style scoped></style>
