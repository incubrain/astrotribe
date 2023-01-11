<template>
    <div class="flex flex-col gap-2">
        <div v-for="skill in skills" class="flex gap-2 items-center">
            <div class="w-[200px] h-[32px] relative bg-red-50 rounded-sm overflow-hidden flex items-center">
                <p class="text-sm font-thin z-40 pl-2 m-0"> {{ skill.name }}</p>
                <span
                :style="{ width: `${skill.rating * 10 * 4}px` }"
                class="bg-[#FBBF24] h-full w-full absolute flex`"
                >
                </span>
            </div>
            {{ skill.rating.toPrecision(2) }}
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    skills: {
        name: string,
        rating: number
    }[]
}>()

</script>

<style scoped>

</style>