<template>
  <div>
    <PrimeTabMenu
      :model="settings.tabs"
      :active-index="0"
    >
      <template #account>
        <LazySettingsAccount />
      </template>
      <template #password>
        <LazySettingsPassword />
      </template>
      <template #default="{ item, index, selected }">
        <div class="flex items-center w-full justify-between gap-2 relative">
          <div class="flex gap-1 items-center">
            <span> {{ index + 1 }}. </span>
            <Icon
              :name="item.icon"
              class="w-4 h-4 flex-shrink-0"
            />
          </div>

          <div class="relative flex gap-2 justify-center items-center">
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="selected"
              class="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
            />
          </div>
        </div>
      </template>
    </PrimeTabMenu>
  </div>
</template>

<script setup lang="ts">
// !todo replace tabs with PrimeMenu or PrimePanelMenu
const settings = useUserSettingsStore()
const users = useUsersStore()
const auth = useAuth()

const { id } = useRoute().params
const { push, back } = useRouter()

if (await users.checkWeHaveUser(String(id))) {
  const { user } = auth
  if (user.value && String(id) === user.value.id) {
    settings.getUserSettings(user.value.id)
  } else if (user.value && String(id) !== user.value.id) {
    push(`/astrotribe/users/${user.value.id}/settings`)
  }
} else {
  console.error('user does not exist in state')
  back()
}

definePageMeta({
  name: 'ProfileSettings',
  layout: 'app'
})
</script>
