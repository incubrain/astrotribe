<script setup lang="ts">
const links = [
  {
    key: 'about-us',
    label: 'About Us',
    icon: 'material-symbols:info',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'about',
        label: 'About',
        icon: 'material-symbols:info',
        url: '/about',
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
        key: 'contact',
        label: 'Contact',
        icon: 'material-symbols:call',
        url: '/contact',
        visible: true,
        disabled: false
      }
    ]
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'material-symbols:event',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'conference',
        label: 'Conference',
        icon: 'material-symbols:emoji-people',
        url: '/conference',
        visible: true,
        disabled: false
      }
    ]
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

const props = defineProps({
  isCompact: {
    type: Boolean,
    default: false
  },
  compactOnScroll: {
    type: Boolean,
    default: false
  }
})

const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)

// !design:high:easy:1 - auto detect session and show AstroTribe button
</script>

<template>
  <div
    class="'flex origin-top-left w-full wrapper lg:justify-center lg:items-center lg:padded-x',"
    :style="{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      transition: 'transform 0.5s ease, left 0.5s ease',
      zIndex: '50'
    }"
  >
    <PrimeMenubar
      :model="links"
      class="rounded-none lg:rounded-b-md w-full"
    >
      <template #start>
        <div class="gap-4 hidden lg:flex rounded-md p-1">
          <div
            class="p-1 h-[36px] w-[36px] md:h-[44px] md:w-[44px] bg-white rounded-md overflow-hidden relative flex justify-center items-center border"
          >
            <BaseImage
              :img="{
                src: '/astronera-logo.jpg'
              }"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <NuxtLink
            to="/"
            class="flex items-center justify-center min-h-full"
          >
            <h1
              class="pr-2 uppercase text-sm font-bold cursor-pointer flex tracking-normal justify-start items-start mt-[2px] leading-none flex-col"
            >
              Astron
              <strong class="text-primary-600 dark:text-primary-700 font-extrabold"> Era </strong>
            </h1>
          </NuxtLink>
        </div>
      </template>
      <template #item="{ item, hasSubmenu, root }">
        <div class="px-4 py-2">
          <NuxtLink
            v-ripple
            :to="item.url"
            class="cursor-pointer"
          >
            <p class="flex items-center gap-1">
              {{ item.label }}
              <Icon
                v-if="hasSubmenu"
                :name="root ? 'mdi:chevron-down' : 'mdi:chevron-right'"
              />
            </p>
          </NuxtLink>
        </div>
      </template>
      <template #end>
        <div class="flex items-center justify-center gap-4 flex-nowrap">
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
          <ClientOnly>
            <div class="gap-4 flex items-center justify-center h-auto min-w-24 pr-2">
              <NuxtLink
                v-if="haveUserSession"
                v-ripple
                to="/astrotribe"
              >
                <PrimeButton
                  :pt="{
                    root: 'border'
                  }"
                  @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
                >
                  Dashboard
                </PrimeButton>
              </NuxtLink>
              <div
                v-else
                class="space-x-4"
              >
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
                  <PrimeButton
                    @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
                  >
                    Astronomy Hub
                  </PrimeButton>
                </NuxtLink>
              </div>
            </div>
          </ClientOnly>
        </div>
      </template>
    </PrimeMenubar>
  </div>
</template>

<style></style>
