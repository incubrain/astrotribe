<template>
  <div class="w-full h-screen flex background relative overflow-hidden lg:p-4">
    <NavAppSidebar class="w-full h-full max-w-[10%] min-w-[140px] hidden lg:flex" />

    <div
      class="w-full h-full pb-[var(--mobi-bottom-nav-height)] lg:pb-0 relative flex flex-col rounded-lg overflow-hidden"
    >
      <NavAppTop />
      <div class="md:p-4 xl:p-8 overflow-y-scroll h-full foreground">
        <div class="h-full">
          <slot />
        </div>
      </div>
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>
