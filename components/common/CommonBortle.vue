<template>
    <div class="flex flex-row w-full h-full rounded-md overflow-hidden items-center">
        <h3 class="p-4 whitespace-nowrap"> Bortle rating </h3>
        <div
            v-for="rate in bortle"
            :key="rate.id"
            class="relative w-full h-full border-r border-slate-500"
        >
            <img
                :src="rate.src"
                alt="bortle dark sky rating"
                class="w-full h-full object-contain"
            />
            <div
                v-if="showAll || rate.id === rating"
                class="absolute w-full h-full text-md text-white z-50 text-l top-0 left-0 flex justify-center items-center">
                <p>
                    {{ rating }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

interface Props {
    rating: number
    showAll: boolean
}

withDefaults(defineProps<Props>(), {
    rating: 3,
    showAll: false,
})

const bortle = [
    { id: 1, src: '/bortle/dark-skies-1.png' },
    { id: 2, src: '/bortle/dark-skies-2.png' },
    { id: 3, src: '/bortle/dark-skies-3.png' },
    { id: 4, src: '/bortle/dark-skies-4.png' },
    { id: 5, src: '/bortle/dark-skies-5.png' },
    { id: 6, src: '/bortle/dark-skies-6.png' },
    { id: 7, src: '/bortle/dark-skies-7.png' },
    { id: 8, src: '/bortle/dark-skies-8.png' },
]

</script>

<style scoped></style>
