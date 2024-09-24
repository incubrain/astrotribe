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
  <transition name="sidebar">
    <div
      v-if="show"
      class="fixed inset-y-0 right-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 md:static md:inset-0"
      :class="{
        'translate-x-0': isSidebarOpen,
        'translate-x-full': !isSidebarOpen,
        'md:translate-x-0': true,
      }"
    >
      <PrimeMenu
        :model="links"
        :pt="{
          root: 'min-h-full flex flex-col rounded-none border-none p-0 w-full h-full hidden md:flex',
          menu: 'pt-8',
        }"
      >
        <template #start>
          <div
            class="flex min-h-[60px] items-center p-3"
            :class="{ 'justify-center': !isSidebarOpen, 'justify-start': isSidebarOpen }"
          >
            <NuxtLink
              to="/"
              class="flex items-center gap-2"
            >
              <Icon
                v-if="!isSidebarOpen"
                name="mdi:rocket"
                size="20px"
              />
              <h1
                v-else
                class="flex cursor-pointer whitespace-nowrap text-lg font-bold leading-none tracking-normal"
              >
                ASTRO
                <strong class="text-highlight"> TRIBE </strong>
              </h1>
            </NuxtLink>
          </div>
        </template>
        <template #submenuheader="{ item }">
          <p v-if="isSidebarOpen">something here to {{ item }}</p>
        </template>
        <template #item="{ item }">
          <div class="w-full">
            <NuxtLink
              :to="item.slug"
              class="block w-full"
            >
              <span
                class="relative flex w-full items-center rounded-[.5rem_0_0_.5rem] p-3.5 text-sm"
                :class="[
                  route.path === item.slug ? 'foreground' : '',
                  isSidebarOpen ? 'justify-start' : 'justify-center',
                ]"
              >
                <Icon
                  :name="item.icon"
                  class="flex shrink-0"
                  size="20px"
                />
                <span
                  v-show="isSidebarOpen"
                  class="overflow-hidden whitespace-nowrap pl-4"
                >
                  {{ item.label }}
                </span>
              </span>
            </NuxtLink>
          </div>
        </template>
      </PrimeMenu>
    </div>
  </transition>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
}
.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0);
}
</style>
