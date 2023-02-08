<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="col-span-2 col-start-1">
            <h1 class="text-2xl font-semibold">{{ user.name }}</h1>
            <h4 class="text-lg">{{ user.profession }}</h4>
            <h6 class="text-md pt-3 flex items-center">
                <Icon name="uil:location-point" size="18px" />
                {{ home.town }}, {{ home.district }}, {{ home.state }},
                {{ home.country }}
            </h6>
            
        </div>
        <div class="col-span-1 lg:col-start-2 flex flex-col gap-2">
            
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: {}
}>()

const home = props.user.location.find(l => l.type === 'home')!

</script>

<style scoped></style>
