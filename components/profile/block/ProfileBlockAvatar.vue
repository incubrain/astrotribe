<template>
    <div
        class="absolute left-0 top-[-60px] md:top-[-80px] w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:top-[-120px] lg:w-[240px] lg:h-[240px] rounded-full border-8
            bg-cover border-white group text-black overflow-hidden"
        :style="{ 'background-image': `url(${avatar})` }"
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
    </div>
</template>

<script setup lang="ts">

defineProps<{
    avatar: string,
}>()

</script>

<style scoped>

</style>
