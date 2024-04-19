<script setup lang="ts">
const userStore = useUsersStore()
const { users } = storeToRefs(userStore)
const haveUsers = computed(() => users.value !== null && users.value.length > 0)

const paginationStore = usePaginationStore()

const fetchInput = ref({
  endpoint: '/api/users/select/many',
  storeKey: 'usersStore',
  criteria: {
    dto: 'select:user:card',
    pagination: paginationStore.getPaginationRange('usersStore'),
    filterBy: {
      columnName: 'role_id',
      operator: 'eq',
      value: 1
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
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 xl:gap-8"
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
