<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  links: {
    type: Array,
    required: true,
  },
  showDevHelpers: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const isSidebarOpen = ref(true) // Desktop specific, open by default
const isMobileSidebarOpen = ref(false) // Mobile specific
</script>

<template>
  <div
    class="inset-y-0 left-0 z-[100] flex flex-col background text-gray-300 shadow-lg transition-all duration-300 group"
    :class="[
      isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
      isSidebarOpen ? 'md:w-60' : 'md:w-14',
    ]"
  >
    <!-- Toggle button -->
    <button
      class="absolute -right-3 top-24 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-700 text-gray-300 opacity-0 transition-opacity duration-300 hover:bg-gray-600 group-hover:opacity-100 md:flex"
      :title="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <Icon
        :name="isSidebarOpen ? 'mdi:chevron-left' : 'mdi:chevron-right'"
        class="h-4 w-4"
      />
    </button>

    <div class="flex h-full flex-col overflow-hidden">
      <!-- Logo -->
      <div class="flex h-16 items-center px-4">
        <NuxtLink
          to="/"
          class="flex items-center"
        >
          <Icon
            name="mdi:infinity"
            size="24px"
            class="text-white"
          />
          <span
            v-if="isSidebarOpen"
            class="ml-2 text-xl font-bold text-white"
            >daily.dev</span
          >
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-1 px-2 py-4">
        <ul>
          <li
            v-for="item in links"
            :key="item.slug"
          >
            <NuxtLink
              :to="item.slug"
              class="flex items-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-gray-700"
              :class="{ 'bg-gray-800': route.path === item.slug }"
            >
              <Icon
                :name="item.icon"
                size="20px"
                class="mr-3 flex-shrink-0"
              />
              <span v-if="isSidebarOpen">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
