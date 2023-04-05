<template>
  <div class="min-h-full card-grid">
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
