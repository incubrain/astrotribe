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
const isSidebarOpen = ref(false) // Mobile specific
const isSidebarExpanded = ref(false)
</script>

<template>
  <!-- Hamburger Icon for Mobile -->
  <button
    class="fixed left-4 top-4 z-50 md:hidden"
    @click="isSidebarOpen = !isSidebarOpen"
  >
    <!-- Hamburger SVG Icon -->
    <svg
      class="h-6 w-6 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <!-- Sidebar -->
  <div
    :class="[
      'fixed inset-y-0 left-0 z-[100] flex flex-col background shadow-lg transition-all duration-300',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    ]"
    @mouseover="isSidebarExpanded = true"
    @mouseleave="isSidebarExpanded = false"
  >
    <!-- Adjust the width based on expansion -->
    <div
      :class="[
        'transition-width flex h-full flex-col overflow-hidden duration-300',
        isSidebarExpanded ? 'w-64' : 'w-16',
      ]"
    >
      <!-- Sidebar Content -->
      <div class="flex max-h-24 min-h-24 items-center justify-start p-4">
        <NuxtLink
          v-show="!isSidebarExpanded"
          to="/"
        >
          <Icon
            name="mdi:rocket"
            size="24px"
          />
        </NuxtLink>
        <NuxtLink
          v-show="isSidebarExpanded"
          to="/"
        >
          <h1 class="flex cursor-pointer text-lg font-bold leading-none">
            ASTRO
            <strong class="text-highlight"> TRIBE </strong>
          </h1>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="scrollbar-hide flex-1 overflow-y-auto hover:overflow-y-scroll">
        <ul>
          <li
            v-for="item in links"
            :key="item.slug"
          >
            <NuxtLink
              :to="item.slug"
              class="flex items-center p-4 hover:bg-primary-900"
            >
              <Icon
                :name="item.icon"
                size="24px"
                class="flex shrink-0 min-w-[24px]"
              />
              <span
                class="ml-4 whitespace-nowrap"
                :class="isSidebarExpanded ? 'w-64 opacity-100' : 'w-0 opacity-0'"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* WebKit */
}
</style>
