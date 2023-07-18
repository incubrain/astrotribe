<template>
  <div>
    <div v-if="users !== null" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8">
      <CardUser
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
    <div v-else>
      No users found
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'All' })

const users = ref(null)

const { error, data } = await useFetch('/api/users/many')
if (error.value) throw createError(`error getting users: ${error.value.message}`)
if (data.value) users.value = data.value.users
</script>
