// components/nav/NavMobiBottom.vue
<script setup lang="ts">
const { appLinks } = usePages()

// Function to get main navigation items from categories
const mainNavItems = computed(() => {
  // For mobile, we'll show:
  // 1. Home from 'main' category
  // 2. Feed from 'news' category
  // 3. Profile links
  const items = []

  // Get home from main
  const mainCategory = appLinks.value.find((cat) => cat.id === 'main')
  if (mainCategory?.items?.[0]) {
    items.push(mainCategory.items[0])
  }

  // Get feed from news
  const newsCategory = appLinks.value.find((cat) => cat.id === 'news')
  if (newsCategory?.items?.[0]) {
    items.push(newsCategory.items[0])
  }

  // Get profile section
  // const profileCategory = appLinks.value.find((cat) => cat.id === 'profile')
  // if (profileCategory?.items?.[0]) {
  //   // Add first profile item (or you can create a specific profile route)
  //   items.push({
  //     id: profileCategory.items[0].id,
  //     label: 'Profile',
  //     slug: '/profile',
  //     icon: 'mdi:account-circle-outline',
  //   })
  // }

  return items
})

// Active route handling
const route = useRoute()
const isActive = (slug: string) => {
  if (slug === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(slug)
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 flex-row w-full items-center justify-between foreground p-2 h-[var(--mobi-bottom-nav-height)] border-t border-color"
  >
    <ul class="flex flex-row items-center justify-center w-full h-full">
      <li
        v-for="item in mainNavItems"
        :key="item.id"
        class="flex items-center justify-center w-full h-full cursor-pointer"
      >
        <NuxtLink
          :to="item.slug"
          class="flex flex-col justify-center items-center gap-1 px-2"
          :class="{ 'text-primary-500': isActive(item.slug) }"
        >
          <ClientOnly>
            <Icon
              :name="item.icon"
              size="24px"
            />
            <span class="text-xs">{{ item.label }}</span>
          </ClientOnly>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-primary-500;
}

/* Optional: Add transition for active state */
.router-link-active .icon {
  @apply transform scale-110 transition-transform;
}
</style>
