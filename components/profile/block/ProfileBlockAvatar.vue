<template>
    <div
        class="absolute left-0 top-[-60px] w-[120px] h-[120px] lg:top-[-120px] lg:w-[240px] lg:h-[240px] rounded-full border-8
            bg-cover border-white group text-black overflow-hidden"
        :style="{ 'background-image': `url(/users/avatars/${avatar})` }"
    >
        <InteractiveModal
            :buttonsVisible="false"
            modalTitle="Upload Avatar"
            class="hidden justify-center items-center w-full h-full group-hover:flex">
            <SupaUpload>
                Upload Avatar
            </SupaUpload>
        </InteractiveModal>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    avatar: string,
}>()

</script>

<style scoped></style>
