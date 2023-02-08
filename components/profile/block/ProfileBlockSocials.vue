<template>
    <div class="card flex flex-col gap-2 items-center">
        <h1 class="text-2xl pb-4 font-semibold">Connect</h1>
        <span
            v-for="social in socials"
            :key="social.name"
            class="flex gap-2 items-center bg-blue-50 rounded-lg p-2 w-full"
        >
            <a :href="social.url" class="flex justify-center">
                <Icon name="mdi:linkedin" size="24px" class="mr-1" />
                {{ social.name }}
            </a>
        </span>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    socials: [
        {
            name: string
            url: string
        }
    ]
}>()

</script>

<style scoped></style>
