<script setup lang="ts">
const userStore = useUsersStore()
const { users } = storeToRefs(userStore)
const haveUsers = computed(() => users.value !== null && users.value.length > 0)

const paginationStore = usePaginationStore()

const fetchInput = ref({
  endpoint: '/api/users/select/cards',
  storeKey: 'usersStore',
  criteria: {
    dto: 'select:user:card',
    pagination: paginationStore.getPaginationRange('usersStore'),
    filterBy: {
      columnName: 'role',
      operator: 'eq',
      value: 'user'
    }
  }
})

watchEffect(() => {
  if (haveUsers.value === false) {
    console.log('Fetching users')
    userStore.loadUsers(fetchInput.value)
  }
})

console.log('users', users)

definePageMeta({ name: 'Users', layout: 'app' })
</script>

<template>
  <div>
    <BaseInfiniteScroll
      store-key="usersStore"
      :pagination="{
        page: 1,
        limit: 20
      }"
      @update:scroll-end="userStore.loadUsers(fetchInput)"
    >
      <div
        v-if="haveUsers"
        class="grid grid-cols-1 max-w-sm mx-auto border border-color"
      >
        <UserCard
          v-for="(user, index) in users"
          :key="user.id"
          :user="user"
        />
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
