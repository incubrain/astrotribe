<template>
  <div>
    <CommonCoverImg :url="util.users.cover(s.user.id, s.user.cover_image)" />
    <div
      class="grid mx-auto grid-cols-1 lg:grid-cols-[minmax(40px,1fr)_minmax(300px,804px)_300px_minmax(40px,1fr)] bg-[#fff] md:bg-[#fff0]  md:px-4 mb-2 md:mb-0"
    >
      <div
        class="rounded-lg row-start-1 col-span-1 col-start-2 lg:col-start-3 w-full relative bg-cover"
      >
        <ProfileBlockBadge
          class="absolute bottom-0 right-0 mr-4 md:mr-0"
          :user-role="s.user.main_role"
        />
      </div>
      <div
        class="bg-white w-full relative col-start-1 lg:col-start-1 row-span-1 col-span-1 lg:col-span-3 row-start-2 pt-16 md:pt-[100px] lg:pt-[140px] md:px-6 md:pb-6 rounded-b-lg"
      >
        <ProfileBlockAvatar
          :avatar="util.users.avatar(s.user.id, s.user.avatar)"
          class="ml-4 md:ml-0"
        />
        <ProfileBlockInfo :user="s.user" />
      </div>
      <div
        class="w-full relative flex flex-col gap-2 md:mt-4 md:gap-4 row-start-3 col-start-1 row-span-1 col-span-1 lg:col-span-3 bg-gray-200"
      >
        <ProfileBlockSkills
          v-if="s.user.user_skills.length > 0"
          :skills="s.user.user_skills"
          class="card"
        />
        <ProfileBlockSocials
          v-if="s.user.user_socials.length > 0"
          :socials="s.user.user_socials"
          class="card"
        />
        <!-- <ProfileBlockExperties
          v-if="s.user.user_skills.length > 0"
          :expertise="s.user.user_skills"
          class="p-6"
        /> -->
        <CommonBlockText
          v-if="s.user.quote"
          :body="s.user.quote"
          class="card"
          title="Favourite Quote"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id

console.log('profile', id)
const util = useUtils()

const u = useUsersStore()
await u.getSingleUser({ userId: Number(id) })

const s = appState()
console.log('userProfile', s.user)

definePageMeta({
  name: 'Profile'
})
</script>
