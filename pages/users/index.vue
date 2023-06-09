<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
  >
    <CardUser
      v-for="user in s.users"
      :key="user.id"
      :user="user"
    />
    <!-- <div class="md:col-span-2">
            <button
                class="bg-blue-500 text-white rounded-md px-4 py-2"
                @click="post.users.many()"
            >
            Create Users</button>
        </div> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'All' })

// const post = useCreate()

const u = useUsersStore()
await u.testUserRoles({ userId: 1 })
await u.getUsers({ userId: 1 })
// await u.getUserFollowed({ userId: 1 })

const s = appState()
</script>
