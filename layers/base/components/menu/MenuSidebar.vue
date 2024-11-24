<script setup lang="ts">
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  showDevHelpers: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
  isMobileSidebarOpen: {
    type: Boolean,
    required: true,
  },
})

const route = useRoute()
const emit = defineEmits(['update:isSidebarOpen', 'update:isMobileSidebarOpen'])
// Handle navigation - close mobile nav when navigating
const handleNavigation = () => {
  if (props.isMobile) {
    emit('update:isMobileSidebarOpen', false)
  }
}

// Watch route changes to close mobile nav
watch(
  () => route.path,
  () => {
    if (props.isMobile) {
      emit('update:isMobileSidebarOpen', false)
    }
  },
)
</script>

<template>
  <div class="relative z-50">
    <!-- Mobile Overlay -->
    <div
      v-if="isMobile"
      class="fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300"
      :class="
        isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      "
      @click="$emit('update:isMobileSidebarOpen', false)"
    />
    <div
      class="flex flex-col background text-gray-300 shadow-lg transition-all duration-300 group"
      :class="[
        'h-full',
        isMobile && [
          'fixed left-0 top-0 bottom-0 z-[100]',
          'w-[70vw]',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ],
        !isMobile && ['relative', 'md:translate-x-0', isSidebarOpen ? 'md:w-60' : 'md:w-14'],
      ]"
    >
      <!-- Toggle button (desktop only) -->
      <button
        v-if="!isMobile"
        class="absolute !z-[1000] -right-3 top-24 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-gray-300 transition-opacity duration-300 hover:bg-primary-400 group-hover:opacity-100 md:flex"
        :class="['z-[110]', isSidebarOpen ? 'opacity-0' : 'opacity-100']"
        :title="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="$emit('update:isSidebarOpen', !isSidebarOpen)"
      >
        <Icon
          :name="isSidebarOpen ? 'mdi:chevron-left' : 'mdi:chevron-right'"
          size="12px"
        />
      </button>

      <div class="flex h-full flex-col overflow-hidden">
        <!-- Logo section remains unchanged -->
        <div
          class="flex items-center px-4 py-3 transition-all duration-300"
          :class="isMobile || isSidebarOpen ? 'gap-3' : 'justify-center'"
        >
          <div
            class="flex items-center justify-center rounded-md border bg-white transition-all duration-300 delay-150"
            :class="isMobile || isSidebarOpen ? 'h-10 w-10' : 'h-6 w-6'"
          >
            <NuxtLink
              to="/"
              class="flex h-full w-full items-center justify-center"
            >
              <IBImage
                :img="{ src: '/astronera-logo.jpg', width: 36, height: 36 }"
                class="h-full w-full transition-all duration-300"
                :class="isMobile || isSidebarOpen ? 'p-0.5' : 'p-1'"
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
              v-if="isMobile || isSidebarOpen"
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
              v-if="isMobile || isSidebarOpen"
              class="px-2 text-xs font-semibold uppercase text-gray-400"
            >
              {{ category.label }}
            </div>
            <ul class="space-y-1">
              <li
                v-for="item in category.items"
                :key="item.id"
              >
                <!-- Regular menu items -->
                <template v-if="!item.children">
                  <IBMenuItem
                    :icon="item.icon"
                    :label="item.label"
                    :to="item.slug"
                    :is-active="route.path === item.slug"
                    :is-mobile="isMobile"
                    :is-sidebar-open="isSidebarOpen"
                    @click="handleNavigation"
                  />
                </template>

                <!-- Submenu for My Feeds -->
                <template v-else>
                  <IBMenuNested
                    :items="item.children"
                    :is-mobile="isMobile"
                    :is-sidebar-open="isSidebarOpen"
                    @expand-sidebar="$emit('update:isSidebarOpen', true)"
                  />
                </template>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<style>
.transition-transform {
  transition-property: transform, width, height;
}
</style>
