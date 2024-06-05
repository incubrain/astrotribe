<script setup lang="ts">
const router = useRouter()
const userStore = useCurrentUser()
const { profile, isAdmin } = storeToRefs(userStore)

const profileMenu = ref(null)
const toggleMenu = (e) => {
  profileMenu.value?.toggle(e)
}

const auth = useAuth()
const items = computed(() => {
  const menuItems = [
    {
      label: 'Profile',
      command: () => router.push(`/astrotribe/users/${profile.value.user_id}`)
    },
    {
      label: 'Settings',
      command: () => router.push(`/astrotribe/users/${profile.value.user_id}/settings/profile`)
    },
    {
      label: 'Logout',
      command: () => auth.logout()
    }
  ]

  if (isAdmin.value) {
    menuItems.splice(2, 0, {
      label: 'Admin',
      command: () => router.push(`/astrotribe/admin/users`)
    })
  }

  return menuItems
})

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading('currentUser'))

const avatarUrl = ref(null)

watch(
  profile,
  (newProfile) => {
    avatarUrl.value = newProfile?.avatar
  },
  { immediate: true }
)

const logError = (error) => {
  console.info('Error loading image, default image rendered', error)
  avatarUrl.value = '/images/defaults/avatar.jpg'
}

const nonce = useNonce()

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
    <ClientOnly>
      <div
        v-if="isLoading || !profile?.user_role"
        class="flex gap-4 justify-end items-center"
      >
        <PrimeSkeleton class="min-w-10 min-h-4 rounded-md" />
        <PrimeSkeleton
          :pt="{
            root: 'min-w-10 min-h-10 rounded-full'
          }"
        />
      </div>
      <div
        class="flex items-center justify-center gap-4"
        v-else-if="profile?.user_role"
      >
        <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
          <Icon
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
            class="w-6 h-6 cursor-pointer"
            @click="toggle"
          />
        </AppThemeToggle> -->
        <PrimeTag v-if="profile.user_role">
          {{ profile.user_role }}
        </PrimeTag>
        <PrimeAvatar
          v-if="avatarUrl"
          :image="avatarUrl"
          size="normal"
          shape="circle"
          class="cursor-pointer"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="toggleMenu"
          @error="logError"
          :nonce="nonce"
          crossorigin="anonymous"
        />
        <PrimeMenu
          id="overlay_menu"
          ref="profileMenu"
          :model="items"
          :popup="true"
        />
      </div>
    </ClientOnly>
  </div>
</template>
