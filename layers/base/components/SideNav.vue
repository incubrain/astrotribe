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
      <div
        class="flex items-center px-4 py-3 transition-all duration-300"
        :class="isSidebarOpen ? 'gap-3' : 'justify-center'"
      >
        <div
          class="flex items-center justify-center rounded-md border bg-white transition-all duration-300 delay-150"
          :class="isSidebarOpen ? 'h-10 w-10' : 'h-6 w-6'"
        >
          <NuxtLink
            to="/"
            class="flex h-full w-full items-center justify-center"
          >
            <IBImage
              :img="{ src: '/astronera-logo.jpg', width: 36, height: 36 }"
              class="h-full w-full transition-all duration-300"
              :class="isSidebarOpen ? 'p-0.5' : 'p-1'"
              no-shrink
            />
          </NuxtLink>
        </div>
        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 -translate-x-4"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <div
            v-if="isSidebarOpen"
            class="flex cursor-pointer flex-col items-start justify-center text-sm font-bold uppercase leading-none tracking-normal"
          >
            Astron
            <strong class="font-extrabold text-primary-400">Era</strong>
          </div>
        </Transition>
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
.transition-transform {
  transition-property: transform, width, height;
}
</style>
