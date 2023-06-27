<template>
  <div>
    <CommonCoverImg
      :url="
        supaStorage.image.single({
          bucket: 'profile-public',
          folderPath: `${s.user.id}/cover`,
          file: s.user.cover_image,
          fileType: 'user-cover',
          isPrivate: false,
        })
      "
    />
    <div
      class="grid mx-auto max-w-[1080px] grid-cols-1 lg:grid-cols-[minmax(40px,1fr)_minmax(300px,804px)_300px_minmax(40px,1fr)] md:px-4 mb-2 md:mb-0"
    >
      <div
        class="relative w-full col-span-1 col-start-2 row-start-1 bg-cover rounded-lg lg:col-start-3"
      >
        <ProfileBlockBadge
          class="absolute bottom-0 right-0 mr-4 md:mr-0"
          :user-role="s.user.main_role"
        />
      </div>
      <div
        class="relative w-full col-span-1 col-start-1 row-span-1 row-start-2 rounded-b-lg lg:col-start-1 lg:col-span-3 md:px-6 md:pb-6 foreground"
      >
        <ProfileBlockAvatar
          :avatar="
            supaStorage.image.single({
              bucket: 'profile-public',
              folderPath: `${s.user.id}/avatar`,
              file: s.user.avatar,
              fileType: 'user-avatar',
              isPrivate: false,
            })
          "
        />
        <ProfileBlockInfo
          :user="s.user"
          class="sm:mt-[80px] md:mt-[100px] lg:mt-[140px]"
        />
      </div>
      <div
        class="relative flex flex-col w-full col-span-1 col-start-1 row-span-1 row-start-3 gap-2 md:mt-4 md:gap-4 lg:col-span-3"
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

const supaStorage = useStorage()
const u = useUsersStore()
await u.getSingleUser({ userId: Number(id) })

const s = appState()
console.log('userProfile', s.user)

definePageMeta({
  name: 'Profile'
})
</script>
