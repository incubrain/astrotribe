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

const screenHeight = ref(0)
const screenWidth = ref(null as number | null)
const scrollPercentage = ref(0)
const compactOnScroll = computed(() => props.compactOnScroll)
const isSmall = ref(false)
const navbarMaxWidth = computed(() => (isSmall.value ? '70px' : '1000px'))

watchEffect(() => {
  if (compactOnScroll.value && scrollPercentage.value >= 100) {
    isSmall.value = true
  }

  if (screenWidth.value) {
    if (screenWidth.value < 1020) {
      isSmall.value = false
    }
  }
})

const toggleIsSmall = () => {
  isSmall.value = !isSmall.value
}

onMounted(() => {
  screenHeight.value = window.innerHeight
  screenWidth.value = window.innerWidth
  isSmall.value = props.isCompact
  window.addEventListener('resize', () => {
    screenHeight.value = window.innerHeight
    screenWidth.value = window.innerWidth
  })

  const { y } = useScroll(window)
  watch(
    y,
    (newY) => {
      // Calculate the scroll percentage
      const percentage = (y.value / screenHeight.value) * 100
      scrollPercentage.value = Math.min(100, Math.max(0, percentage)) // Clamps the value between 0% and 100%
    },
    { immediate: true }
  )
})

// Clean up the event listener when the component unmounts
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    screenHeight.value = window.innerHeight
  })
})

const auth = useAuth()

// !design:high:easy:1 - auto detect session and show AstroTribe button
</script>

<template>
  <div
    :class="[
      'lg:rounded-full flex origin-top-left w-full',
      isSmall ? 'lg:justify-left lf:items-left' : 'lg:justify-center lg:items-center'
    ]"
    :style="{
      position: 'fixed',
      top: isSmall ? '1.5rem' : '0',
      left: isSmall ? '1.5rem' : '0',
      right: isSmall ? '0' : '0',
      transition: 'transform 0.5s ease, left 0.5s ease',
      zIndex: '50'
    }"
  >
    <PrimeMenubar
      :model="links"
      class="rounded-none lg:rounded-full w-full"
      :style="{
        maxWidth: navbarMaxWidth,
        maxHeight: navbarMaxWidth,
        overflow: isSmall ? 'hidden' : 'visible'
      }"
    >
      <template #start>
        <div class="gap-4 hidden lg:flex rounded-md p-1">
          <div
            class="p-1 h-[36px] w-[36px] md:h-[44px] md:w-[44px] bg-white rounded-full overflow-hidden relative flex justify-center items-center border"
          >
            <NuxtImg
              src="/astronera-logo.jpg"
              class="w-full h-full dark:opacity-90"
            />
            <div class="absolute text-black z-50">
              <Icon
                :name="isSmall ? 'mdi:menu' : 'mdi:chevron-left'"
                size="32"
                @click="toggleIsSmall"
              />
            </div>
          </div>
          <NuxtLink
            v-show="!isSmall"
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
        <div class="flex items-center justify-center gap-2 flex-nowrap">
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
          <div class="gap-2 flex items-center justify-center h-auto min-w-24">
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
              v-if="auth.isLoggedIn"
              v-ripple
              to="/astrotribe"
            >
              <PrimeButton
                :pt="{
                  root: 'lg:rounded-r-full border'
                }"
                @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
              >
                Dashboard
              </PrimeButton>
            </NuxtLink>
            <NuxtLink
              v-else
              v-ripple
              to="/auth/register"
            >
              <PrimeButton
                :pt="{
                  root: 'lg:rounded-r-full'
                }"
                @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
              >
                Astronomy Hub
              </PrimeButton>
            </NuxtLink>
          </div>
        </div>
      </template>
    </PrimeMenubar>
  </div>
</template>

<style></style>
