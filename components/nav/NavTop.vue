<template>
  <PrimeMenubar
    :model="links"
    :pt="{
      root: 'rounded-none lg:rounded-md'
    }"
    class="fixed top-0 lg:top-4 lg:mx-4 z-50 w-full lg:w-[calc(100%-2em)] background"
  >
    <template #start>
      <NuxtLink
        to="/"
        class="items-center gap-2 hidden lg:flex"
      >
        <div
          class="p-1 h-[26px] w-[26px] md:h-[34px] md:w-[34px] bg-white rounded-full overflow-hidden"
        >
          <NuxtImg
            src="/astronera-logo.jpg"
            class="w-full h-full dark:opacity-90"
          />
        </div>
        <h1
          class="block px-4 mr-4 text-xl font-semibold cursor-pointer hover:text-primary-600 dark:hover:text-primary-700"
        >
          AstronEra
        </h1>
      </NuxtLink>
    </template>
    <template #item="{ item, hasSubmenu, root }">
      <div class="px-4 py-2">
        <NuxtLink
          v-ripple
          :to="item.url"
        >
          <span class="flex items-center gap-1">
            <!-- <Icon :name="item.icon" /> -->
            {{ item.label }}
            <Icon
              v-if="hasSubmenu"
              :name="root ? 'mdi:chevron-down' : 'mdi:chevron-right'"
            />
          </span>
        </NuxtLink>
      </div>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-2">
        <AppThemeToggle v-slot="{ toggle, isDark }">
          <Icon
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
            class="w-6 h-6 cursor-pointer"
            @click="toggle"
          />
        </AppThemeToggle>
        <NuxtLink
          to="https://github.com/incubrain/astrotribe"
          target="_blank"
          class="flex justify-center items-center"
        >
          <Icon
            name="mdi:github"
            class="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex justify-center items-center"
          />
        </NuxtLink>
        <div class="gap-2 flex items-center justify-center h-auto">
          <NuxtLink
            v-ripple
            to="/auth/login"
          >
            <PrimeButton
              severity="secondary"
              outlined
              @click="$posthog()?.capture('login_app', { location: 'top_nav' })"
            >
              login
            </PrimeButton>
          </NuxtLink>
          <NuxtLink
            v-ripple
            to="/auth/register"
          >
            <PrimeButton @click="$posthog()?.capture('register_app', { location: 'top_nav' })">
              Join Free
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </template>
  </PrimeMenubar>
</template>

<script setup lang="ts">
const links = [
  {
    key: 'about',
    label: 'About',
    icon: 'material-symbols:info',
    url: '/about',
    visible: true,
    disabled: false
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: 'material-symbols:call',
    url: '/contact',
    visible: true,
    disabled: false
  },
  {
    key: 'team',
    label: 'Team',
    icon: 'material-symbols:emoji-people',
    url: '/team',
    visible: true,
    disabled: false
  },
  {
    key: 'conference',
    label: 'Conference',
    icon: 'material-symbols:emoji-people',
    url: '/conference',
    visible: true,
    disabled: false
  },
  {
    key: 'community',
    label: 'Community',
    icon: 'material-symbols:globe-asia',
    url: '/astrotribe',
    visible: true,
    disabled: false
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'blog-home',
        label: 'All',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog',
        visible: true,
        disabled: false
      },
      {
        key: 'blog-isro',
        label: 'ISRO',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/isro',
        visible: true,
        disabled: false
      }
    ]
  }
]

// const dropdownItems = computed(() => [
//   {
//     label: 'Profile',
//     onClick: () => router.push(`/astrotribe/users/${user.value?.id}`)
//   },
//   {
//     label: 'Settings',
//     onClick: () => router.push(`/astrotribe/users/${user.value?.id}/settings`)
//   },
//   {
//     label: 'Logout',
//     onClick: () => auth.logout()
//   }
// ])
</script>
