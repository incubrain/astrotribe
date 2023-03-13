<template>
    <div class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        lg:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
        2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        rounded-md shadow-sm gap-6
    ">
        {{ v.venues }}
    </div>
</template>

<script setup lang="ts">

// definePageMeta({ name: 'All' })

const v = useVenuesStore()

await v.getVenues()

console.log('users', v.users)

</script>