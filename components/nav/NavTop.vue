<template>
  <nav
    class="flex sticky top-0 left-0 items-center md:items-stretch w-full justify-end md:justify-between foreground z-50 border-b border-color h-[var(--nav-height-sm)] md:h-[var(--nav-height-md)] lg:h-[var(--nav-height-lg)]"
  >
    <div
      class="grid grid-cols-2 lg:grid-cols-[minmax(240px,_0.5fr)_minmax(420px,_2fr)_minmax(300px,_1fr)] items-center w-full md:flex justify-between text-zinc-900 dark:text-zinc-100"
    >
      <div class="border-color lg:border-r h-full pl-3 md:pl-4 flex col-start-1">
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
          <h1 class="blockpx-4 mr-4 text-xl font-semibold md:text-2xl"> AstronEra </h1>
        </NuxtLink>
      </div>
      <div class="lg:flex hidden items-center h-full w-full col-span-2 col-start-2 md:col-span-1">
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
      <div class="relative flex col-span-1 w-full col-start-3 pr-3 md:pr-6">
        <div class="flex items-center justify-end w-full gap-4">
          <a
            href="https://github.com/incubrain/astrotribe"
            target="_blank"
          >
            <UIcon
              name="i-mdi-github"
              class="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex justify-center items-center"
            />
          </a>
          <DarkToggle v-slot="{ toggle, isDark }">
            <UIcon
              :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              class="w-6 h-6 cursor-pointer"
              @click="toggle"
            />
          </DarkToggle>
          <div v-if="!loggedIn">
            <UButtonGroup>
              <UButton
                variant="link"
                to="/auth/login"
              >
                login
              </UButton>
              <UButton to="/auth/register"> Join Free </UButton>
            </UButtonGroup>
          </div>
          <div
            v-else
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
                Logged in
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="flex justify-center items-center w-5 h-5"
                />
              </UButton>
            </UDropdown>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const auth = useAuth()
const loggedIn = computed(() => auth.isLoggedIn.value)
const user = computed(() => auth.user.value)

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
    onClick: () => router.push(`/astrotribe/users/${user.value.id}`)
  },
  {
    label: 'Settings',
    onClick: () => router.push(`/astrotribe/users/${user.value.id}/settings`)
  },
  {
    label: 'Logout',
    onClick: () => auth.logout()
  }
])
</script>
