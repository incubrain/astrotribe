<script setup lang="ts">
const { appLinks } = usePages()
const showPrelaunchMessage = useCookie<boolean>('frontiers_message', { default: () => true })
</script>

<template>
  <div class="h-screen flex flex-col relative background">
    <RoleOverride />
    <div class="w-full flex backgroun d overflow-hidden lg:py-4 lg:pr-4 h-full">
      <IBMenuSidebar :categories="appLinks" />
      <div
        class="w-full h-full pb-[var(--mobi-bottom-nav-height)] lg:pb-0 relative flex flex-col rounded-lg overflow-hidden"
      >
        <NavAppTop />
        <div class="overflow-y-auto overflow-x-hidden h-full foreground">
          <div class="h-full">
            <slot />
          </div>
        </div>
      </div>
      <NavMobiBottom class="lg:hidden" />
    </div>
  </div>
</template>
