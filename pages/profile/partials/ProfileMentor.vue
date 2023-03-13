<template>
    <div
        class="w-full relative grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6 row-start-3 row-span-1 lg:col-start-2"
    >
        <CommonBlockText
            :body="user.introduction"
            title="Introduction"
            class="lg:col-span-2"
        />
        <ProfileBlockSocials :socials="user.socials" class="col-span-1" />
        <CommonBlockText
            :body="user.quote"
            title="Favourite Quote"
            class="lg:col-span-3"
        />
        <!-- <ProfileExpertise :expertise="mentor.expertise" /> -->
    </div>
</template>

<script setup lang="ts">
import type { UserFull } from '@/types/types'

defineProps({
    user: {
        type: Object as PropType<UserFull>,
        required: true,
    },
})
</script>

<style scoped></style>
