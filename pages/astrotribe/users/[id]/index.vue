<script setup lang="ts">
import { storeUsers } from '~/composables/stores/storeUsers'

const user = storeUsers()
const userId = computed(() => useRoute().params.id)

console.log('id', userId)

watch(
  userId,
  (newId) => {
    console.log('newId', newId)
    user.getUserById(String(newId))
  },
  { immediate: true }
)

const currentProfile = computed(() => user.userCurrent)

definePageMeta({
  name: 'Profile',
  layout: 'app'
})
</script>

<template>
  <div>
    <div v-if="currentProfile.id">
      <CommonCoverImg :url="currentProfile.cover_image" />
      <div
        class="grid mx-auto max-w-[1080px] grid-cols-1 lg:grid-cols-[minmax(40px,1fr)_minmax(300px,804px)_300px_minmax(40px,1fr)] md:px-4 mb-2 md:mb-0"
      >
        <div
          class="relative w-full col-span-1 col-start-2 row-start-1 bg-cover rounded-lg lg:col-start-3"
        >
          <ProfileBlockBadge
            class="absolute bottom-0 right-0 mr-4 md:mr-0"
            :user-role="currentProfile.role"
          />
        </div>
        <div
          class="relative w-full col-span-1 col-start-1 row-span-1 row-start-2 rounded-b-lg lg:col-start-1 lg:col-span-3 md:px-6 md:pb-6 foreground"
        >
          <ProfileBlockAvatar :avatar="currentProfile.avatar" />
          <ProfileBlockInfo
            :user="currentProfile"
            class="mt-[80px] md:mt-[140px]"
          />
        </div>
        <div
          class="relative flex flex-col w-full col-span-1 col-start-1 row-span-1 row-start-3 gap-2 md:mt-4 md:gap-4 lg:col-span-3 md:mb-24"
        >
          <!-- <ProfileBlockSkills
            v-if="currentProfile.user_skills.length > 0"
            :skills="currentProfile.user_skills"
            class="card"
          /> -->
          <!-- <ProfileBlockSocials
            v-if="currentProfile.user_socials.length > 0"
            :socials="currentProfile.user_socials"
            class="card"
          /> -->
          <!-- <ProfileBlockExperties
            v-if="currentProfile.user_skills.length > 0"
            :expertise="currentProfile.user_skills"
            class="p-6"
          /> -->
          <CommonBlockText
            v-if="currentProfile.quote"
            :body="currentProfile.quote"
            title="Favourite Quote"
          />
        </div>
      </div>
    </div>
  </div>
</template>
