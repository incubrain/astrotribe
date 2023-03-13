<template>
    <div class="card flex flex-col gap-2">
        <h1 class="text-2xl pb-4 font-semibold">Connect</h1>
        <span
            v-for="social in socials"
            :key="social.id"
            class="flex gap-2 items-center bg-blue-50 rounded-lg p-2 w-full"
        >
            <a
                :href="social.url"
                class="flex justify-center"
            >
                <Icon :name="`mdi:${social.platform}`" size="24px" class="mr-1" />
                {{  util.upperCaseFirstLetter(social.platform) }}
            </a>
        </span>
    </div>
</template>

<script setup lang="ts">

import type { Socials } from '@/types/types'

defineProps({
    socials: {
        type: Array as PropType<Socials[]>,
        required: true,
    },
})

const util = useUtilities()

</script>

<style scoped></style>
