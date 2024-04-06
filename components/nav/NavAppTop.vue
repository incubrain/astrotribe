<script setup lang="ts">
const router = useRouter()
const user = useCurrentUser()

const profileMenu = ref(null)
const toggleMenu = (e) => {
  profileMenu.value.toggle(e)
}

const auth = useAuth()
const items = ref([
  {
    label: 'Profile',
    command: () => router.push(`/astrotribe/users/${user.profile.id}`)
  },
  {
    label: 'Settings',
    command: () => router.push(`/astrotribe/users/${user.profile.id}/settings`)
  },
  {
    label: 'Logout',
    command: () => auth.logout()
  }
])

console.log('profile', user.profile)

// !todo: show a back button on tablet and below, left of nav.
// !todo: add styling to profileMenu nav to make it full screen on tablet and below
</script>

<template>
  <div
    class="z-50 w-full background sticky top-0 left-0 px-4 py-1 flex flex-row items-center justify-between gap-4 border-b border-color min-h-[60px]"
  >
    <!-- start -->
    <div> something </div>
    <!-- center -->
    <div class="px-4 py-2"> searchbar </div>
    <!-- end -->
    <div class="flex items-center justify-center gap-2">
      <AppThemeToggle v-slot="{ toggle, isDark }">
        <Icon
          :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
          class="w-6 h-6 cursor-pointer"
          @click="toggle"
        />
      </AppThemeToggle>
      <PrimeAvatar
        v-if="user.profile?.avatar"
        :image="user.profile?.avatar"
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
