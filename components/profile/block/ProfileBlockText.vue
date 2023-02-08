<template>
    <div class="card">
        <h1 class="text-2xl pb-4 font-semibold">{{ title }}</h1>
        <p class="pb-2">
            {{ body }}
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    body: string
}>()
</script>

<style scoped></style>
