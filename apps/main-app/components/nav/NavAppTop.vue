<script setup lang="ts">
const router = useRouter()
const userStore = useCurrentUser()
const { profile, isAdmin } = storeToRefs(userStore)
const { aeAdminUrl } = useRuntimeConfig().public

const profileMenu = ref(null)
const toggleMenu = (e) => {
  profileMenu.value?.toggle(e)
}

const auth = useAuth()
const items = computed(() => {
  const menuItems = [
    {
      label: 'Settings',
      command: () => router.push('/profile/settings/profile'),
    },
    {
      label: 'Logout',
      command: () => auth.signOut(),
    },
  ]

  if (isAdmin.value) {
    menuItems.splice(2, 0, {
      label: 'Admin',
      command: () => navigateTo(aeAdminUrl, { external: true }),
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
    avatarUrl.value = newProfile?.avatar || '/defaults/avatar.jpg'
  },
  { immediate: true },
)

const logError = (error) => {
  console.log('Error loading image, default image rendered', error)
}

// !todo: show a back button on tablet and below, left of nav.
// !todo: add styling to profileMenu nav to make it full screen on tablet and below
</script>

<template>
  <div
    class="foreground border-color sticky left-0 top-0 z-50 flex min-h-[60px] w-full flex-row items-center justify-between gap-4 border-b px-4 py-1"
  >
    <!-- start -->
    <div>
      <IBBreadcrumbs class="hidden text-sm lg:block" />
    </div>
    <!-- center -->
    <div class="flex w-full max-w-[70%] gap-4 px-4 py-2 lg:max-w-xl" />
    <!-- end -->
    <ClientOnly>
      <div
        v-if="isLoading || !profile?.user_role"
        class="flex items-center justify-end gap-4"
      >
        <PrimeSkeleton class="min-h-4 min-w-10 rounded-md" />
        <PrimeSkeleton
          :pt="{
            root: 'min-w-10 min-h-10 rounded-full',
          }"
        />
      </div>
      <div
        v-else-if="profile?.user_role"
        class="flex items-center justify-center gap-4"
      >
        <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
          <Icon
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
            class="cursor-pointer"
                      size="24px"

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
          crossorigin="anonymous"
          @error="logError"
          @click="toggleMenu"
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
