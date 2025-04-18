<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    id: string
    label: string
    slug: string
    icon: string
  }>
  label: string
}>()

const isExpanded = ref(false)
const route = useRoute()
const { isMobile, isSidebarOpen, toggleSidebar } = useNavigation()

// Watch for sidebar collapse to close the nested menu
watch(
  () => isSidebarOpen.value,
  (newValue) => {
    if (!newValue && !isMobile.value) {
      isExpanded.value = false
    }
  },
)

const handleClick = (e: Event) => {
  e.preventDefault() // Prevent default only for the menu toggle
  if (!isMobile.value && !isSidebarOpen.value) {
    toggleSidebar(true)
    // Wait for sidebar expansion animation to complete before expanding nested menu
    setTimeout(() => {
      isExpanded.value = true
    }, 300)
  } else {
    isExpanded.value = !isExpanded.value
  }
}

// Simplified click handler - just handle the mobile menu state
const handleItemClick = () => {
  if (isMobile.value) {
    isExpanded.value = false
  }
}
</script>

<template>
  <div class="space-y-1">
    <button
      class="flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-primary-700"
      @click="handleClick"
    >
      <Icon
        name="mdi:rss"
        size="20px"
        class="mr-3 flex-shrink-0"
      />
      <span
        v-if="isMobile || isSidebarOpen"
        class="flex-1 text-left"
      >
        {{ label }}
      </span>
      <Icon
        v-if="isMobile || isSidebarOpen"
        :name="isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        size="16px"
        class="ml-2"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-in-out"
      leave-active-class="transition-all duration-200 ease-in-out"
      enter-from-class="transform opacity-0 scale-y-0 origin-top"
      enter-to-class="transform opacity-100 scale-y-100 origin-top"
      leave-from-class="transform opacity-100 scale-y-100 origin-top"
      leave-to-class="transform opacity-0 scale-y-0 origin-top"
    >
      <ul
        v-show="isExpanded"
        class="space-y-1 pl-4 overflow-hidden"
      >
        <li
          v-for="item in items"
          :key="item.id"
        >
          <IBMenuItem
            :icon="item.icon"
            :label="item.label"
            :to="item.slug"
            :is-active="route.path === item.slug"
            @click="handleItemClick"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>
