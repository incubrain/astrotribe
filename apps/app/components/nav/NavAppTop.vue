<script setup lang="ts">
const router = useRouter()
const userStore = useCurrentUser()
const toast = useNotification()
const supabase = useSupabaseClient()
const { profile, isAdmin } = storeToRefs(userStore)
const { adminURL, loginURL, authURL } = useRuntimeConfig().public

const profileMenu = ref(null)
const toggleMenu = (e) => {
  profileMenu.value?.toggle(e)
}

const items = computed(() => {
  const menuItems = [
    {
      label: 'Settings',
      command: () => router.push('/settings/account'), // Updated from '/settings/profile'
    },
    {
      label: 'Logout',
      command: signOut,
    },
  ]

  if (isAdmin.value) {
    menuItems.splice(2, 0, {
      label: 'Admin',
      command: () => navigateTo(adminURL, { external: true }),
    })
  }

  return menuItems
})

const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    toast.error({ summary: 'Could not log out', message: error.message })
  } else {
    return navigateTo(String(`${authURL}${loginURL}`), { external: true })
  }
}

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading('currentUser'))

const avatarUrl = ref(null)
const fallbackLoaded = ref(false)

// Generate fallback avatar URL using UI Avatars
const getFallbackAvatarUrl = (name: string) => {
  const initials =
    name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'U'
  return `https://ui-avatars.com/api/?name=${initials}&background=random&size=128`
}

watch(
  profile,
  (newProfile) => {
    if (newProfile?.avatar) {
      avatarUrl.value = newProfile.avatar
      fallbackLoaded.value = false
    } else {
      // Use name from profile for the fallback avatar, or default to 'User'
      avatarUrl.value = getFallbackAvatarUrl(newProfile?.full_name || 'User')
      fallbackLoaded.value = true
    }
  },
  { immediate: true },
)

const handleImageError = () => {
  if (!fallbackLoaded.value) {
    // Only load fallback if we haven't already tried
    avatarUrl.value = getFallbackAvatarUrl(profile.value?.full_name || 'User')
    fallbackLoaded.value = true
  }
  console.log('Avatar image load error, using fallback')
}
</script>

<template>
  <div
    class="foreground border-color sticky left-0 top-0 z-50 flex min-h-[60px] w-full flex-row items-center justify-between gap-4 border-b px-4 py-1"
  >
    <!-- start -->
    <div class="flex items-center gap-4">
      <IBNavHamburger />
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
        ><NuxtLink
          v-if="profile.user_plan"
          to="/settings/payments"
        >
          <PrimeTag class="bg-transparent text-nowrap rounded border border-white"
            >{{ profile.user_plan }} plan active
          </PrimeTag>
        </NuxtLink>
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
          @error="handleImageError"
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
