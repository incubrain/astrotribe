<template>
    <div>
        <p>This page should require login</p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
})
</script>

<style scoped></style>
