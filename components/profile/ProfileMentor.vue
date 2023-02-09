<template>
    <CommonCoverImg />
    <div
        class="min-h-full grid grid-cols-[minmax(160px,1fr)] lg:grid-cols-[minmax(140px,.4fr)_minmax(600px,4fr)_minmax(140px,0.4fr)] lg:max-w-[1240px] mx-auto max-w-[95%]"
    >
        <div
            class="rounded-lg row-start-1 col-span-1 lg:col-start-2 w-full h-[220px] lg:h-[420px] relative bg-cover"
        >
            <ProfileBlockMentorBadge
                class="lg:col-start-2 absolute bottom-0 right-0 bg-[#343434] py-2 px-4 rounded-t-lg"
            />
        </div>
        <div
            class="bg-white w-full h-[200px] relative lg:col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg"
        >
            <ProfileBlockAvatar :avatar="mentor.avatar" />
            <ProfileBlockInfo :user="mentor" />
        </div>
        <div
            class="w-full relative grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6 row-start-3 row-span-1 lg:col-start-2"
        >
            <CommonBlockText
                :body="mentor.introduction"
                title="Introduction"
                class="lg:col-span-2"
            />
            <ProfileBlockSocials :socials="mentor.socials" class="col-span-1" />
            <CommonBlockText
                :body="mentor.quote"
                title="Favourite Quote"
                class="lg:col-span-3"
            />
            <!-- <ProfileExpertise :expertise="mentor.expertise" /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import mentors from '../../assets/data/mentors.json'
import ProfileBlockMentorBadge from './block/ProfileBlockMentorBadge.vue'

const mentor = mentors[0]
</script>

<style scoped></style>
