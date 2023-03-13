<template>
    <div class="card">
        <h1 class="text-2xl pb-4 font-semibold">{{ title }}</h1>
        <p class="pb-2">
            {{ body }}
        </p>
    </div>
</template>

<script setup lang="ts">

interface Props {
    title: string
    body: string
}

withDefaults(defineProps<Props>(), {
    title: 'Title',
    body: 'some body text',
})

</script>

<style scoped></style>
