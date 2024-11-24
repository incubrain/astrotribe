<script setup lang="ts">
const { appLinks } = usePages()
const { isSidebarOpen, isMobileSidebarOpen, isMobile } = useNavigation()
</script>

<template>
  <div class="w-full h-screen flex background relative overflow-hidden lg:py-4 lg:pr-4">
    <IBMenuSidebar
      v-model:is-sidebar-open="isSidebarOpen"
      v-model:is-mobile-sidebar-open="isMobileSidebarOpen"
      :categories="appLinks"
      :is-mobile="isMobile"
    />
    <div
      class="w-full h-full pb-[var(--mobi-bottom-nav-height)] lg:pb-0 relative flex flex-col rounded-lg overflow-hidden"
    >
      <NavAppTop />
      <div class="overflow-y-scroll h-full foreground">
        <div class="h-full">
          <slot />
        </div>
      </div>
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>
