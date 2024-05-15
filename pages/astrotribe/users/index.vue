<script setup lang="ts">
const domainKey = 'users'

const userStore = useUsersStore()
const { users } = storeToRefs(userStore)

const haveUsers = computed(() => users.value !== null && users.value.length > 0)

const fetchInput = ref({
  endpoint: '/api/users/select/cards',
  domainKey,
  pagination: {
    page: 1,
    limit: 20
  },
  criteria: {
    dto: 'select:user:card',
    filterBy: {
      columnName: 'role',
      operator: 'eq',
      value: 'user'
    }
  }
}) as Ref<FetchInput>

watchEffect(() => {
  if (haveUsers.value === false) {
    console.log('Fetching users')
    userStore.loadUsers(fetchInput.value)
  }
})

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({ name: 'Users', layout: 'app' })
</script>

<template>
  <div>
    <BaseInfiniteScroll
      :domain-key="domainKey"
      :pagination="{
        page: 1,
        limit: 20
      }"
      @update:scroll-end="userStore.loadUsers(fetchInput)"
    >
      <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]">
        <BaseSidebar />
        <div class="flex flex-col max-w-sm md:col-start-2 mx-auto w-full">
          <UserCard
            v-for="(user, index) in users"
            :key="user.id"
            :user="user"
          />
          <UserCardSkeleton v-show="isLoading" />
        </div>
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
