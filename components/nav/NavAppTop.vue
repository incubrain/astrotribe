<script setup lang="ts">
const router = useRouter()
const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)

const profileMenu = ref(null)
const toggleMenu = (e) => {
  profileMenu.value?.toggle(e)
}

const auth = useAuth()
const items = ref([
  {
    label: 'Profile',
    command: () => router.push(`/astrotribe/users/${profile.value.id}`)
  },
  {
    label: 'Settings',
    command: () => router.push(`/astrotribe/users/${profile.value.id}/settings/profile`)
  },
  {
    label: 'Logout',
    command: () => auth.logout()
  }
])

// !todo: show a back button on tablet and below, left of nav.
// !todo: add styling to profileMenu nav to make it full screen on tablet and below
</script>

<template>
  <div
    class="z-50 w-full foreground sticky top-0 left-0 px-4 py-1 flex flex-row items-center justify-between gap-4 border-b border-color min-h-[60px]"
  >
    <!-- start -->
    <div>
      <BaseBreadcrumbs class="text-sm hidden lg:block" />
    </div>
    <!-- center -->
    <div class="px-4 py-2 flex gap-4 w-full max-w-[70%] lg:max-w-xl">
      <SearchBar class="w-full" />
    </div>
    <!-- end -->
    <div class="flex items-center justify-center gap-4">
      <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
        <Icon
          :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
          class="w-6 h-6 cursor-pointer"
          @click="toggle"
        />
      </AppThemeToggle> -->
      <PrimeAvatar
        v-if="profile?.avatar"
        :image="profile?.avatar"
        size="normal"
        shape="circle"
        class="cursor-pointer"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="toggleMenu"
      />
      <PrimeMenu
        id="overlay_menu"
        ref="profileMenu"
        :model="items"
        :popup="true"
      />
    </div>
  </div>
</template>
