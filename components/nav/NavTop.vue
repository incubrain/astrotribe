<template>
  <nav
    class="flex sticky top-0 left-0 items-center md:items-stretch w-full justify-end md:justify-between background z-50 border-b border-color h-[var(--nav-height-sm)] md:h-[var(--nav-height-md)] lg:h-[var(--nav-height-lg)]"
  >
    <div
      class="grid lg:grid-cols-nav items-center w-full md:flex justify-between text-zinc-900 dark:text-zinc-100"
    >
      <div class="border-color lg:w-[240px] lg:border-r h-full pl-3 md:pl-4 flex flex-shrink-0 justify-between items-center col-start-1">
        <NavMobiSlideover
          :links="links"
          class="lg:hidden pl-3 md:pl-4 flex items-center"
        />
        <NuxtLink
          to="/"
          class="items-center gap-2 nav-link hidden lg:flex"
        >
          <div
            class="p-1 h-[26px] w-[26px] md:h-[34px] md:w-[34px] bg-white rounded-full overflow-hidden border border-color"
          >
            <NuxtImg
              src="/astronera-logo.jpg"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <h1 class="block px-4 mr-4 text-xl font-semibold"> AstronEra </h1>
        </NuxtLink>
      </div>
      <div
        class="lg:flex hidden items-center h-full w-full col-span-2 col-start-2 md:col-span-1"
      >
        <div
          class="items-center justify-center hidden h-full gap-4 pl-4 text-sm font-semibold leading-none lg:flex whitespace-nowrap"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.id"
            :to="link.slug"
            class="nav-link"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="relative flex col-span-1 col-start-3 pr-3 md:pr-6 flex-shrink-0">
        <div class="flex items-center justify-center w-full gap-4">
          <NuxtLink
            to="https://github.com/incubrain/astrotribe"
            target="_blank"
            class="flex justify-center items-center"
          >
            <UIcon
              name="i-mdi-github"
              class="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex justify-center items-center"
            />
          </NuxtLink>
          <DarkToggle v-slot="{ toggle, isDark }">
            <UIcon
              :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              class="w-6 h-6 cursor-pointer"
              @click="toggle"
            />
          </DarkToggle>
          <div
            v-if="isLoggedIn"
            class="flex gap-4"
          >
            <UDropdown
              :items="[dropdownItems]"
              :popper="{ placement: 'bottom-start' }"
              mode="hover"
            >
              <UButton
                color="white"
                class="flex items-center justify-center"
              >
                Logged in {{ auth.isLoggedIn }}
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="flex justify-center items-center w-5 h-5"
                />
              </UButton>
            </UDropdown>
          </div>
          <div v-else>
            <div class="space-x-2">
              <UButton
                variant="link"
                to="/auth/login"
              >
                login
              </UButton>
              <UButton to="/auth/register"> Join Free </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const auth = useAuth()
const user = useSupabaseUser()

// !todo - move this to a pinia store
const isLoggedIn = computed(() => {
  return user.value !== null
})

const router = useRouter()

const links = [
  {
    id: 0,
    name: 'About',
    slug: '/about',
    icon: 'i-material-symbols-info',
    children: []
  },
  {
    id: 1,
    name: 'Contact',
    slug: '/contact',
    icon: 'i-material-symbols-call',
    children: []
  },
  {
    id: 2,
    name: 'Team',
    slug: '/team',
    icon: 'i-material-symbols-emoji-people',
    children: []
  },
  {
    id: 3,
    name: 'Conference',
    slug: '/conference',
    icon: 'i-material-symbols-emoji-people',
    children: []
  },
  {
    id: 4,
    name: 'Poster Competition',
    slug: '/poster-competition',
    icon: 'i-material-symbols-award-star',
    children: []
  },
  {
    id: 5,
    name: 'Community',
    slug: '/astrotribe',
    icon: 'i-material-symbols-globe-asia',
    children: []
  }
]

const dropdownItems = computed(() => [
  {
    label: 'Profile',
    onClick: () => router.push(`/astrotribe/users/${user.value?.id}`)
  },
  {
    label: 'Settings',
    onClick: () => router.push(`/astrotribe/users/${user.value?.id}/settings`)
  },
  {
    label: 'Logout',
    onClick: () => auth.logout()
  }
])
</script>
