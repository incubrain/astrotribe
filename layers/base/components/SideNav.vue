<script setup lang="ts">
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  showDevHelpers: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const isSidebarOpen = ref(true)
const isMobileSidebarOpen = ref(false)
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
      class="absolute -right-3 top-24 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-gray-300 opacity-0 transition-opacity duration-300 hover:bg-primary-400 group-hover:opacity-100 md:flex"
      :title="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <Icon
        :name="isSidebarOpen ? 'mdi:chevron-left' : 'mdi:chevron-right'"
        size="12px"
      />
    </button>

    <div class="flex h-full flex-col overflow-hidden">
      <!-- Logo -->
      <div class="flex items-center gap-2 px-4 py-3">
        <div
          class="flex h-[36px] w-[36px] items-center justify-center rounded-md border bg-white p-1 md:h-[38px] md:w-[38px]"
        >
          <NuxtLink
            to="/"
            class="flex items-center"
          >
            <IBImage
              :img="{ src: '/astronera-logo.jpg' }"
              class="h-full w-full opacity-90"
            />
          </NuxtLink>
        </div>
        <h4
          class="mt-[2px] flex cursor-pointer flex-col items-start justify-start pr-2 text-sm font-bold uppercase leading-none tracking-normal"
        >
          Astron
          <strong class="font-extrabold text-primary-400">Era</strong>
        </h4>
      </div>

      <!-- Navigation Categories -->
      <nav class="flex-1 space-y-4 px-2 py-4">
        <div
          v-for="category in categories"
          :key="category.id"
          class="space-y-1"
        >
          <div
            v-if="isSidebarOpen"
            class="px-2 text-xs font-semibold uppercase text-gray-400"
          >
            {{ category.label }}
          </div>
          <ul>
            <li
              v-for="item in category.items"
              :key="item.slug"
            >
              <NuxtLink
                :to="item.slug"
                class="flex items-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-primary-700"
                :class="{ 'bg-primary-800': route.path === item.slug }"
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
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
