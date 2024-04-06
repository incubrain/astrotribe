<script setup lang="ts">
import { storeUsers } from '~/composables/stores/storeUsers'

const userStore = storeUsers()
const haveUsers = await userStore.checkWeHaveUsers()
const { users } = storeToRefs(userStore)

console.log('users', users)

definePageMeta({ name: 'Users', layout: 'app' })
</script>

<template>
  <div>
    <div
      v-if="haveUsers"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 xl:gap-8"
    >
      <LazyUserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
  </div>
</template>
