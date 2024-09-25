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
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg transition-all duration-300',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0', // Always visible on md and up
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
      <div class="flex h-16 items-center justify-center">
        <NuxtLink to="/">
          <Icon
            name="mdi:rocket"
            size="24px"
          />
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1">
        <ul>
          <li
            v-for="item in links"
            :key="item.slug"
          >
            <NuxtLink
              :to="item.slug"
              class="flex items-center p-4 hover:bg-gray-100"
            >
              <Icon
                :name="item.icon"
                size="24px"
              />
              <span
                v-if="isSidebarExpanded"
                class="ml-4 whitespace-nowrap"
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

<style scoped></style>
