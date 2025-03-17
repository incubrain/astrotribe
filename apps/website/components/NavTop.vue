<script setup lang="ts">
interface NavItem {
  key: string
  label: string
  icon: string
  visible: boolean
  disabled: boolean
  url?: string
  items?: NavItem[]
}

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

// Props
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

// Window scroll handling
const { y } = useWindowScroll()
const lastScrollY = ref(y.value)
const isScrollingDown = ref(false)
const isNavbarVisible = ref(true)

// Scroll threshold to trigger navbar changes
const scrollThreshold = 50
const isScrolled = computed(() => y.value > scrollThreshold)

// Navbar classes based on scroll position
const navbarClasses = computed(() => {
  const classes = []

  // Hide navbar when scrolling down beyond threshold
  if (!isNavbarVisible.value) {
    classes.push('animate-slide-up')
  } else if (isScrolled.value) {
    classes.push('animate-slide-down')
  }

  // Apply compact style when scrolled
  if (props.compactOnScroll && isScrolled.value) {
    classes.push('navbar-compact')
  }

  return classes.join(' ')
})

// Navbar background opacity and blur based on scroll
const glassStyle = computed(() => {
  const opacity = 0.1
  const blur = 16

  return {
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    borderBottom: isScrolled.value ? '1px solid rgba(100, 100, 150, 0.1)' : 'none',
  }
})

// Mobile menu handling
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

// Detect mobile size on component mount and window resize
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    isNavbarVisible.value = true
  }
}

// Watch scroll position to show/hide navbar
watch(y, (newY) => {
  if (isMobile.value) {
    isNavbarVisible.value = true
    return
  }

  isScrollingDown.value = newY > lastScrollY.value

  // Only hide navbar when scrolling down and past the threshold
  if (isScrollingDown.value && newY > scrollThreshold + 50) {
    isNavbarVisible.value = false
  } else if (!isScrollingDown.value) {
    isNavbarVisible.value = true
  }

  lastScrollY.value = newY
})

// Search component integration
const isSearchOpen = ref(false)
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="navbarClasses"
    :style="glassStyle"
  >
    <div class="wrapper mx-auto">
      <div
        class="flex items-center justify-between h-16"
        :class="{ 'h-14': props.compactOnScroll && isScrolled }"
      >
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
              class="px-3 py-2 rounded-md text-white font-medium hover:bg-primary-50/50 hover:text-primary-600 transition-colors"
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
              class="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg background backdrop-blur-md border border-color opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
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
      class="lg:hidden bg-black/05 backdrop-blur-md border-t border-primary-100/30 shadow-lg"
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
        <div class="pt-4 border-t border-primary-100 flex flex-col gap-2">
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
/* Animations for navbar */
@keyframes slide-down {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease forwards;
}

.animate-slide-up {
  animation: slide-up 0.3s ease forwards;
}

/* Transition for compact navbar */
.navbar-compact {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Ensure smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
