<template>
  <div>
    <div
      v-if="haveUsers"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
    >
      <LazyUserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const u = useUsersStore()
const haveUsers = await u.checkWeHaveUsers()
const { users } = storeToRefs(u)

definePageMeta({ name: 'Users' })
</script>
