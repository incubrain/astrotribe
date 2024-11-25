<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    id: string
    label: string
    slug: string
    icon: string
  }>
  isMobile?: boolean
  isSidebarOpen?: boolean
}>()

const emit = defineEmits(['expand-sidebar'])
const isExpanded = ref(false)
const route = useRoute()

// Watch for sidebar collapse to close the nested menu
watch(
  () => props.isSidebarOpen,
  (newValue) => {
    if (!newValue && !props.isMobile) {
      isExpanded.value = false
    }
  },
)

const handleClick = () => {
  if (!props.isMobile && !props.isSidebarOpen) {
    emit('expand-sidebar')
    // Wait for sidebar expansion animation to complete before expanding nested menu
    setTimeout(() => {
      isExpanded.value = true
    }, 300) // Match this with the sidebar's transition duration
  } else {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<template>
  <div class="space-y-1">
    <!-- Submenu trigger -->
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
        My Feeds
      </span>
      <Icon
        v-if="isMobile || isSidebarOpen"
        :name="isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        size="16px"
        class="ml-2"
      />
    </button>

    <!-- Submenu items -->
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
            :is-mobile="isMobile"
            :is-sidebar-open="isSidebarOpen"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>
