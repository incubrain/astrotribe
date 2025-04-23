<script setup lang="ts">
// 1. Imports
import { useWindowScroll } from '@vueuse/core'
import { getNavigation } from '#shared/constants'

// Place this at the top of your nuxt.config.ts after importing env

const websiteLinks = getNavigation()

// 3. Component Options
defineOptions({
  name: 'NavTop',
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
console.log('USE RUNTIME CONFIG', useRuntimeConfig().public)
console.log('Public Environment Variables', process.env.NODE_ENV)
// 6. Other Composables
const { y } = useWindowScroll()

// 7. Reactive Variables
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const isScrolled = ref(false)
const expandedItems = ref<Record<number, boolean>>({})
const expandedSubItems = ref<Record<string, boolean>>({})

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

function toggleMobileSubMenu(index: number | string, level: 'main' | 'sub') {
  if (level === 'main') {
    expandedItems.value = {
      ...expandedItems.value,
      [index as number]: !expandedItems.value[index as number],
    }
  } else {
    expandedSubItems.value = {
      ...expandedSubItems.value,
      [index as string]: !expandedSubItems.value[index as string],
    }
  }
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
            <NuxtLink
              v-if="!item.items || !item.items.length"
              :to="item.url || '/'"
              class="px-3 py-2 rounded-md text-white font-medium hover:bg-primary-50/50 hover:text-primary-600 transition-colors duration-300"
            >
              <div class="flex items-center gap-1">
                <Icon
                  :name="item.icon"
                  class="w-4 h-4"
                />
                <span>{{ item.label }}</span>
              </div>
            </NuxtLink>

            <button
              v-else
              class="px-3 py-2 rounded-md text-white font-medium hover:bg-primary-50/50 hover:text-primary-600 transition-colors duration-300"
            >
              <div class="flex items-center gap-1">
                <Icon
                  :name="item.icon"
                  class="w-4 h-4"
                />
                <span>{{ item.label }}</span>
                <Icon
                  name="i-mdi-chevron-down"
                  class="w-4 h-4"
                />
              </div>
            </button>

            <!-- Dropdown for desktop -->
            <div
              v-if="item.items && item.items.length"
              class="dropdown-menu absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg border border-primary-100/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50"
            >
              <div class="py-1">
                <NuxtLink
                  v-for="subItem in item.items"
                  :key="subItem.key"
                  :to="subItem.url || '/'"
                  class="block px-4 py-2 text-sm text-gray-100 hover:bg-primary-50/50 hover:text-primary-600 relative group/sub"
                >
                  <div class="flex items-center gap-2 justify-between">
                    <div class="flex items-center gap-2">
                      <Icon
                        :name="subItem.icon"
                        class="w-4 h-4"
                      />
                      <span>{{ subItem.label }}</span>
                    </div>
                    <Icon
                      v-if="subItem.items && subItem.items.length"
                      name="i-mdi-chevron-right"
                      class="w-4 h-4"
                    />
                  </div>

                  <!-- Dropdown for desktop (Level 2) -->
                  <div
                    v-if="subItem.items && subItem.items.length"
                    class="dropdown-submenu absolute left-full top-0 mt-0 ml-0 w-56 rounded-md shadow-lg border border-primary-100/10 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible"
                  >
                    <div class="py-1">
                      <NuxtLink
                        v-for="childItem in subItem.items"
                        :key="childItem.key"
                        :to="childItem.url || '/'"
                        class="block px-4 py-2 text-sm text-gray-100 hover:bg-primary-50/50 hover:text-primary-600"
                      >
                        <div class="flex items-center gap-2">
                          <Icon
                            :name="childItem.icon"
                            class="w-4 h-4"
                          />
                          <span>{{ childItem.label }}</span>
                        </div>
                      </NuxtLink>
                    </div>
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
            :collection="['blog']"
            button-class="text-white"
            button-label=""
            auto-navigate
          />

          <!-- Authentication buttons -->
          <div class="hidden lg:flex items-center gap-2">
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
          v-for="(item, index) in websiteLinks"
          :key="item.key"
          class="mobile-nav-item"
        >
          <!-- Main nav item with dropdown toggle -->
          <div
            class="px-3 py-2 rounded-md text-white font-medium cursor-pointer"
            @click="toggleMobileSubMenu(index, 'main')"
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
                :name="expandedItems[index] ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
                size="20"
              />
            </div>
          </div>

          <!-- Level 1 submenu -->
          <div
            v-if="item.items && item.items.length && expandedItems[index]"
            class="pl-4 mt-1 space-y-1"
          >
            <div
              v-for="(subItem, subIndex) in item.items"
              :key="subItem.key"
            >
              <!-- Level 1 item with potential level 2 dropdown -->
              <div
                class="flex items-center justify-between px-3 py-2 rounded-md text-white text-sm cursor-pointer"
                @click="
                  subItem.items && subItem.items.length
                    ? toggleMobileSubMenu(`${index}-${subIndex}`, 'sub')
                    : navigateTo(subItem.url || '/')
                "
              >
                <div class="flex items-center gap-2">
                  <Icon
                    :name="subItem.icon"
                    size="20"
                  />
                  <span>{{ subItem.label }}</span>
                </div>
                <Icon
                  v-if="subItem.items && subItem.items.length"
                  :name="
                    expandedSubItems[`${index}-${subIndex}`]
                      ? 'i-mdi-chevron-up'
                      : 'i-mdi-chevron-down'
                  "
                  size="16"
                />
              </div>

              <!-- Level 2 submenu -->
              <div
                v-if="
                  subItem.items && subItem.items.length && expandedSubItems[`${index}-${subIndex}`]
                "
                class="pl-4 mt-1 space-y-1"
              >
                <NuxtLink
                  v-for="childItem in subItem.items"
                  :key="childItem.key"
                  :to="childItem.url || '/'"
                  class="block px-3 py-2 rounded-md text-white text-xs"
                >
                  <div class="flex items-center gap-2">
                    <Icon
                      :name="childItem.icon"
                      size="16"
                    />
                    <span>{{ childItem.label }}</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
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
.dropdown-menu,
.dropdown-submenu {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  transition: all 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
  z-index: 50;
}

.dropdown-submenu {
  margin-left: 1px; /* Small offset to prevent flickering */
}

/* Remove animations that could cause flicker */
.is-compact {
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.3);
}
</style>
