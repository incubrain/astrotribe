<script setup lang="ts">
const websiteLinks = [
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
        disabled: false,
      },
      {
        key: 'team',
        label: 'Team',
        icon: 'material-symbols:emoji-people',
        url: '/team',
        visible: true,
        disabled: false,
      },
      {
        key: 'contact',
        label: 'Contact',
        icon: 'material-symbols:call',
        url: '/contact',
        visible: true,
        disabled: false,
      },
    ],
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
        url: '/blog/category-all/page-1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-dark-sky-conservation',
        label: 'Conservation',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category-dark-sky-conservation/page-1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-people-of-space',
        label: 'People',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category-people-of-space/page-1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-space-exploration',
        label: 'Exploration',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category-space-exploration/page-1',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-sustainable-development',
        label: 'Sustainability',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/category-sustainable-development/page-1',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'astronomy_events',
    label: 'Events',
    icon: 'material-symbols:calendar_month',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'astronomy_events',
        label: 'Astronomy Events',
        icon: 'material-symbols:rocket_launch',
        url: '/events/astronomy-events',
        visible: true,
        disabled: false,
      },
      {
        key: 'telescope_workshop_2025',
        label: 'Telescope Workshop 2025',
        icon: 'material-symbols:manufacturing',
        url: '/events/telescope-workshop-2025',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'darksky',
    label: 'Dark Sky',
    icon: 'material-symbols:work',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'darkskyAbout',
        label: 'About',
        icon: 'material-symbols:weather-night',
        url: '/darksky',
        visible: true,
        disabled: false,
      },
      {
        key: 'conferences',
        label: 'Conferences',
        icon: 'material-symbols:rocket_launch',
        url: '/conferences',
        visible: true,
        disabled: false,
      },
      {
        key: 'symposiums',
        label: 'Symposiums',
        icon: 'material-symbols:manufacturing',
        url: '/symposiums',
        visible: true,
        disabled: false,
      },
    ],
  },
]

defineProps({
  isCompact: {
    type: Boolean,
    default: false,
  },
  compactOnScroll: {
    type: Boolean,
    default: false,
  },
})

const { y } = useWindowScroll()
const lastScrollY = ref(y.value)
const navbarClasses = computed(() => {
  if (navPosition.value === 'fixed') {
    return ''
  } else {
    return navPosition.value === 'hidden' ? 'animate-bounce-out' : 'animate-bounce-in'
  }
})

const navPosition = ref('fixed')

watch(
  y,
  (newY) => {
    if (window?.innerWidth < 1024) {
      navPosition.value = 'fixed'
    } else if (newY > lastScrollY.value) {
      navPosition.value = 'hidden'
    } else if (newY < lastScrollY.value) {
      navPosition.value = 'visible'
    }
    lastScrollY.value = newY
  },
  { immediate: true },
)
</script>

<template>
  <div
    ref="navbar"
    class="flex min-w-full w-full fixed top-0 left-0 right-0 z-50"
    :class="navbarClasses"
  >
    <!-- Modified container structure -->
    <div class="w-full">
      <!-- Glass Background -->
      <LandingGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        isolate-content
        class="!w-full absolute inset-0 pointer-events-none"
        :padded="false"
        :rounded="false"
        :overflow="true"
      />

      <!-- Content Layer -->
      <PrimeMenubar
        :model="websiteLinks"
        class="w-full text-white rounded-none lg:rounded-b-xl bg-transparent border-none relative z-10"
        :pt="{
          root: {
            class: 'flex items-center justify-between px-4 py-2',
          },
          submenu: {
            class:
              '!bg-primary-950/95 backdrop-blur-xl md:absolute md:flex-col flex !text-sm !font-bold !text-white border border-primary-500/50 rounded-md',
          },
        }"
      >
        <template #start>
          <div class="hidden gap-4 rounded-md p-1 lg:flex">
            <div
              class="relative flex h-[36px] w-[36px] items-center justify-center rounded-md border bg-white p-1 md:h-[44px] md:w-[44px]"
            >
              <IBImage
                :img="{
                  src: '/astronera-logo.jpg',
                }"
                class="h-full w-full opacity-90"
              />
            </div>
            <NuxtLink
              to="/"
              class="flex min-h-full items-center justify-center"
            >
              <h4
                class="mt-[2px] flex cursor-pointer flex-col items-start justify-start pr-2 text-sm font-bold uppercase leading-none tracking-normal"
              >
                Astron
                <strong class="font-extrabold text-primary-400">Era</strong>
              </h4>
            </NuxtLink>
          </div>
        </template>
        <template #item="{ item, hasSubmenu, root }">
          <div class="px-4 py-2">
            <NuxtLink
              :to="item.url"
              class="cursor-pointer text-white text-nowrap"
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
          <div class="flex flex-nowrap items-center justify-center gap-4 lg:pr-2">
            <NuxtLink
              to="https://github.com/incubrain/astrotribe"
              target="_blank"
              class="hidden items-center justify-center lg:flex"
            >
              <Icon
                name="mdi:github"
                class="flex cursor-pointer items-center justify-center"
                size="24px"
              />
            </NuxtLink>
            <div class="flex h-auto min-w-24 items-center justify-center gap-2 lg:gap-4">
              <div class="space-x-2 lg:space-x-4">
                <NuxtLink
                  v-ripple
                  :to="$config.public.authURL"
                >
                  <PrimeButton
                    severity="contrast"
                    outlined
                  >
                    login
                  </PrimeButton>
                </NuxtLink>

                <NuxtLink
                  v-ripple
                  :to="`${$config.public.authURL}/register`"
                >
                  <PrimeButton>Join AstronEra</PrimeButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </PrimeMenubar>
    </div>
  </div>
</template>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}

.navbar {
  display: flex !important;
  position: static !important;
  background-color: red !important; /* Just to make it obvious */
  z-index: 9999 !important;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounce-out {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out forwards;
}

.animate-bounce-out {
  animation: bounce-out 1s ease-in forwards;
}
</style>
