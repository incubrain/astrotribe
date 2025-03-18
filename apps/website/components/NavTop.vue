<script setup lang="ts">
// 1. Imports
import { useWindowScroll } from '@vueuse/core'

// 2. Types
interface NavItem {
  key: string
  label: string
  icon: string
  visible: boolean
  disabled: boolean
  url?: string
  items?: NavItem[]
}

// 3. Component Options
defineOptions({
  name: 'SiteNavbar',
})

// 4. Props and Emits
const props = defineProps({
  isCompact: {
    type: Boolean,
    default: false,
  },
  compactOnScroll: {
    type: Boolean,
    default: false,
  },
})

// 5. Core Nuxt Composables
const { $config } = useNuxtApp()

// 6. Other Composables
const { y } = useWindowScroll()

// 7. Reactive Variables
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const isScrolled = ref(false)

// Static data
const websiteLinks: NavItem[] = [
  {
    key: 'about-us',
    label: 'About Us',
    icon: 'i-mdi-information-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'about',
        label: 'About',
        icon: 'i-mdi-information-outline',
        url: '/about',
        visible: true,
        disabled: false,
      },
      {
        key: 'team',
        label: 'Team',
        icon: 'i-mdi-account-group-outline',
        url: '/team',
        visible: true,
        disabled: false,
      },
      {
        key: 'advertising',
        label: 'Advertising',
        icon: 'i-mdi-bullhorn-outline',
        url: '/advertising',
        visible: true,
        disabled: false,
      },
      {
        key: 'contact',
        label: 'Contact',
        icon: 'i-mdi-phone-outline',
        url: '/contact',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'i-mdi-book-open-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'blog-home',
        label: 'All',
        icon: 'i-mdi-book-open-outline',
        url: '/blog/category/all',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-dark-sky-conservation',
        label: 'Conservation',
        icon: 'i-mdi-nature-outline',
        url: '/blog/category/dark-sky-conservation',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-people-of-space',
        label: 'People',
        icon: 'i-mdi-account-group-outline',
        url: '/blog/category/people-of-space',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-space-exploration',
        label: 'Exploration',
        icon: 'i-mdi-rocket-launch-outline',
        url: '/blog/category/space-exploration',
        visible: true,
        disabled: false,
      },
      {
        key: 'blog-sustainable-development',
        label: 'Sustainability',
        icon: 'i-mdi-leaf-outline',
        url: '/blog/category/sustainable-development',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'astronomy_events',
    label: 'Events',
    icon: 'i-mdi-calendar-month-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'astronomy_events',
        label: 'Astronomy Events',
        icon: 'i-mdi-rocket-launch-outline',
        url: '/events/astronomy-events',
        visible: true,
        disabled: false,
      },
      {
        key: 'telescope_workshop_2025',
        label: 'Telescope Workshop 2025',
        icon: 'i-mdi-telescope',
        url: '/events/telescope-workshop-2025',
        visible: true,
        disabled: false,
      },
    ],
  },
  {
    key: 'darksky',
    label: 'Dark Sky',
    icon: 'i-mdi-weather-night',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'darkskyAbout',
        label: 'About',
        icon: 'i-mdi-weather-night',
        url: '/darksky',
        visible: true,
        disabled: false,
      },
      {
        key: 'conferences',
        label: 'Conferences',
        icon: 'i-mdi-presentation',
        url: '/conferences',
        visible: true,
        disabled: false,
      },
      {
        key: 'symposiums',
        label: 'Symposiums',
        icon: 'i-mdi-school-outline',
        url: '/symposiums',
        visible: true,
        disabled: false,
      },
    ],
  },
]

// 8. Computed Properties
const navbarClass = computed(() => {
  const baseClasses = ['fixed', 'top-0', 'left-0', 'right-0', 'z-50']

  if (props.compactOnScroll && isScrolled.value) {
    baseClasses.push('is-compact')
  }

  return baseClasses
})

const navbarStyle = computed(() => {
  // Using CSS variables for smoother transitions
  return {
    '--nav-opacity': isScrolled.value ? '0.8' : '0.1',
    '--nav-blur': isScrolled.value ? '16px' : '8px',
    '--nav-border-opacity': isScrolled.value ? '0.1' : '0',
    '--nav-height': props.compactOnScroll && isScrolled.value ? '56px' : '64px',
    'backgroundColor': 'rgba(0, 0, 0, var(--nav-opacity))',
    'backdropFilter': 'blur(var(--nav-blur))',
    'borderBottom': '1px solid rgba(100, 100, 150, var(--nav-border-opacity))',
    'height': 'var(--nav-height)',
    'transition': 'all 400ms cubic-bezier(0.215, 0.61, 0.355, 1)',
  }
})

// 9. Watchers
watch(
  y,
  (newY) => {
    // Use a debounced check for scroll position to avoid flickering
    if (newY > 80) {
      if (!isScrolled.value) isScrolled.value = true
    } else {
      if (isScrolled.value) isScrolled.value = false
    }
  },
  { throttle: 100 },
)

// 10. Lifecycle Hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Initial check for scroll position
  if (y.value > 80) {
    isScrolled.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

// 11. Methods
function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}
</script>

<template>
  <header
    :class="navbarClass"
    :style="navbarStyle"
  >
    <div class="wrapper mx-auto h-full">
      <div class="flex items-center justify-between h-full">
        <!-- Logo and Brand -->
        <div class="flex-shrink-0 flex items-center gap-2">
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <div
              class="h-9 w-9 bg-white rounded-md p-1 flex items-center justify-center border border-primary-100/20"
            >
              <IBImage
                :img="{ src: '/astronera-logo.jpg' }"
                class="h-full w-full"
              />
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-primary-400 font-bold text-sm">Astron</span>
              <span class="text-white font-bold text-sm">Era</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1">
          <div
            v-for="item in websiteLinks"
            :key="item.key"
            class="relative group"
          >
            <button
              class="px-3 py-2 rounded-md text-white font-medium hover:bg-primary-50/50 hover:text-primary-600 transition-colors duration-300"
              @click="item.items && item.items.length ? null : navigateTo(item.url || '/')"
            >
              <div class="flex items-center gap-1">
                <Icon
                  :name="item.icon"
                  class="w-4 h-4"
                />
                <span>{{ item.label }}</span>
                <Icon
                  v-if="item.items && item.items.length"
                  name="i-mdi-chevron-down"
                  class="w-4 h-4"
                />
              </div>
            </button>

            <!-- Dropdown for desktop -->
            <div
              v-if="item.items && item.items.length"
              class="dropdown-menu absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg border border-primary-100/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
            >
              <div class="py-1">
                <NuxtLink
                  v-for="subItem in item.items"
                  :key="subItem.key"
                  :to="subItem.url || '/'"
                  class="block px-4 py-2 text-sm text-gray-100 hover:bg-primary-50/50 hover:text-primary-600"
                >
                  <div class="flex items-center gap-2">
                    <Icon
                      :name="subItem.icon"
                      class="w-4 h-4"
                    />
                    <span>{{ subItem.label }}</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-2">
          <!-- Search Button -->
          <BlogSearch
            :collection="['blog', 'docs']"
            button-class="text-white"
            button-label=""
            auto-navigate
          />

          <!-- Authentication buttons -->
          <div class="hidden lg:flex items-center gap-2">
            <NuxtLink
              to="https://github.com/incubrain/astrotribe"
              target="_blank"
              class="p-2 text-white"
            >
              <Icon
                name="i-mdi-github"
                size="20"
              />
            </NuxtLink>

            <NuxtLink
              v-ripple
              :to="$config.public.authURL"
            >
              <PrimeButton
                severity="secondary"
                link
                class="px-4 py-2"
                label="Login"
              />
            </NuxtLink>

            <NuxtLink
              v-ripple
              :to="`${$config.public.authURL}/register`"
            >
              <PrimeButton
                severity="primary"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700"
                label="Join AstronEra"
              />
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            class="lg:hidden p-2 rounded-md text-white focus:outline-none"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <Icon
              :name="isMobileMenuOpen ? 'i-mdi-close' : 'i-mdi-menu'"
              size="20"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden bg-black/80 backdrop-blur-md border-t border-primary-100/30 shadow-lg"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <div
          v-for="item in websiteLinks"
          :key="item.key"
          class="mobile-nav-item"
        >
          <div
            class="px-3 py-2 rounded-md text-white font-medium cursor-pointer"
            @click="item.url ? navigateTo(item.url) : null"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  :name="item.icon"
                  size="20"
                />
                <span>{{ item.label }}</span>
              </div>
              <Icon
                v-if="item.items && item.items.length"
                name="i-mdi-chevron-down"
                size="20"
              />
            </div>
          </div>

          <div
            v-if="item.items && item.items.length"
            class="pl-4 mt-1 space-y-1"
          >
            <NuxtLink
              v-for="subItem in item.items"
              :key="subItem.key"
              :to="subItem.url || '/'"
              class="block px-3 py-2 rounded-md text-white text-sm"
            >
              <div class="flex items-center gap-2">
                <Icon
                  :name="subItem.icon"
                  size="20"
                />
                <span>{{ subItem.label }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile auth buttons -->
        <div class="pt-4 border-t border-primary-100/20 flex flex-col gap-2">
          <NuxtLink
            v-ripple
            :to="$config.public.authURL"
            class="w-full"
          >
            <PrimeButton
              severity="secondary"
              outlined
              class="w-full"
              label="Login"
            />
          </NuxtLink>

          <NuxtLink
            v-ripple
            :to="`${$config.public.authURL}/register`"
            class="w-full"
          >
            <PrimeButton
              severity="primary"
              class="w-full"
              label="Join AstronEra"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-menu {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  transition: all 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

/* Remove animations that could cause flicker */
.is-compact {
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.3);
}
</style>
