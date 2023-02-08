<template>
    <div class="flex flex-col gap-2">
        <div v-for="social in socials" class="flex gap-2 items-center">
            <div class="w-[200px] h-[32px] relative bg-red-50 rounded-sm overflow-hidden flex items-center">
                <p> {{  social }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    socials: {}
}>()

</script>

<style scoped>

</style>