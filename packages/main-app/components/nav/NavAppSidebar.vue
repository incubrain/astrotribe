<script setup lang="ts">
const { appLinks } = usePages()
const route = useRoute()

const isDev = computed(() => useRuntimeConfig().public.nodeEnv === 'development')
const isSidebarOpen = ref(true)
</script>

<template>
  <transition name="sidebar">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-y-0 right-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 md:static md:inset-0"
      :class="{
        'translate-x-0': isSidebarOpen,
        'translate-x-full': !isSidebarOpen,
        'md:translate-x-0': true,
      }"
    >
      <PrimeMenu
        :model="appLinks"
        :pt="{
          root: 'min-h-full flex flex-col rounded-none border-none p-0',
          menu: 'pt-8',
          end: 'flex items-end justify-end h-full',
        }"
        :pt-options="{ mergeSections: true, mergeProps: true }"
      >
        <template #start>
          <div class="flex min-h-[60px] items-center justify-end p-3">
            <NuxtLink
              to="/"
              class="flex items-center justify-end gap-2"
            >
              <h1 class="flex cursor-pointer text-lg font-bold leading-none tracking-normal">
                ASTRO
                <strong class="text-highlight"> TRIBE </strong>
              </h1>
            </NuxtLink>
          </div>
        </template>
        <template #submenuheader="{ item }">
          <p>something here to {{ item }}</p>
        </template>
        <template #item="{ item }">
          <div>
            <NuxtLink
              :to="item.slug"
              class="w-full"
            >
              <span
                :class="
                  route.path.split('/')[2] === item.slug.split('/')[2]
                    ? 'foreground flex w-full items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] p-3 text-sm'
                    : 'flex w-full items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] p-3 text-sm'
                "
              >
                {{ item.label }}
                <Icon
                  :name="item.icon"
                  size="24px"
                />
              </span>
            </NuxtLink>
          </div>
        </template>
        <template #end>
          <div class="flex h-full items-end justify-end p-2" />
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
