<template>
  <div>
    <CommonCoverImg :url="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/${s.user.cover_image}`" />
    <div class="min-h-full grid grid-cols-[2%_95%_2%] mx-auto md:grid-cols-[minmax(40px,1fr)_minmax(300px,804px)_300px_minmax(40px,1fr)]">
      <div class="rounded-lg row-start-1 col-span-1 col-start-2 w-full h-[220px] md:h-[420px] relative bg-cover">
        <ProfileBlockBadge
          class="absolute bottom-0 right-0 bg-[#343434] py-2 px-4 rounded-t-lg"
          :user-role="s.user.main_role"
        />
      </div>
      <div class="bg-white w-full h-[200px] relative col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg">
        <ProfileBlockAvatar :avatar="s.user.avatar" />
        <ProfileBlockInfo :user="s.user" />
      </div>
      <div class="w-full relative flex flex-col mt-6 gap-6 row-start-3 row-span-1 col-start-2">
        <CommonBlockText
          v-if="s.user.introduction"
          :body="s.user.introduction"
          title="Introduction"
        />
        <ProfileBlockSkills
          v-if="s.user.user_skills.length > 0"
          :skills="s.user.user_skills"
          class="lg:col-span-2"
        />
        <ProfileBlockSocials
          v-if="s.user.user_socials.length > 0"
          :socials="s.user.user_socials"
        />
        <ProfileBlockExperties
          v-if="s.user.user_socials.length > 0"
          :expertise="s.user.user_socials"
        />
        <CommonBlockText
          v-if="s.user.quote"
          :body="s.user.quote"
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

const u = useUsersStore()
await u.getSingleUser({ userId: Number(id) })

const s = appState()
console.log('userProfile', s.user)

definePageMeta({
  name: 'Profile'
})
</script>
