<script setup lang="ts">
// !todo:consider - add realtime online status
// !todo:high - add follow/unfollow support
// !todo:fun - add personalized ranking systems, just start with titles
// !todo:med - add more button that opens a modal with more user details, allow users to cycle through users

const icons = [
  // mapped to database role id
  'material-symbols:shield-lock', // admin
  'material-symbols:manage-accounts', //
  'mdi:account-school', // Mentor
  'mdi:book-education', // Teacher
  'mdi:telescope', // AstroGuide
  'material-symbols:menu-book-rounded', // Student
  'material-symbols:account-circle' // Basic user
]

defineProps({
  user: {
    type: Object,
    required: true
  }
})

// const lastSeen = u.time.lastSeen(user.last_seen)
</script>

<template>
  <BaseHoverCard>
    <NuxtLink
      :to="`users/${user.id}`"
      class="flex items-center gap-3 transition-transform origin-top"
    >
      <BaseImage
        :img="{
          src: user.avatar,
          alt: 'User Avatar'
        }"
        class="rounded-full w-12 h-12"
      />
      <div class="space-y-1">
        <h2 class="font-semibold md:text-lg hover:underline hover:underline-offset-2">
          {{ user.given_name }} {{ user.surname }}
        </h2>
        <p class="text-sm font-light">
          <Icon
            :name="user.roles.icon"
            class="w-5 h-5 text-primary-500 dark:text-primary-700 mr-1"
          />
          @{{ user.username }} | {{ user.roles.name }}
        </p>
      </div>
    </NuxtLink>
    <p
      v-if="user.introduction"
      class="text-sm max-h-24 pb-4 lg:group-hover:max-h-none lg:group-hover:overflow-scroll overflow-hidden"
    >
      {{ user.introduction }}
    </p>
  </BaseHoverCard>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
