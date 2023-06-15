<template>
  <NuxtImg
    class="absolute left-0 rounded-full border-8 bg-cover border-color group overflow-hidden"
    :src="avatar"
    sizes="sm:120px md:160px lg:240px"
    width="240"
    height="240"
    format="webp"
    quality="80"
  >
    <!-- <InteractiveModal
            :buttons-visible="false"
            modal-title="Upload Avatar"
            class="hidden justify-center items-center w-full h-full group-hover:flex">
            <SupaUpload
                upload-type="avatar"
            >
                Upload Avatar
            </SupaUpload>
        </InteractiveModal> -->
  </NuxtImg>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
}>()
</script>

<style scoped></style>
