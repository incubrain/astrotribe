<template>
    <div class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
        lg:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        rounded-md shadow-sm gap-6
    ">
        <CardUser2 />
        <CardUser2 />
        <CardUser2 />
        <CardUser2 />
        <CardUser2 />
        <CardUser2 />
        <CardUser2 />
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'All' })

</script>