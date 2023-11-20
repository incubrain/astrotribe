<template>
  <div class="w-full h-full flex">
    <NavSidebar class="w-full min-h-full max-w-[10%] min-w-[240px]" />

    <div
      class="w-full mx-auto md:p-4 xl:p-8 min-h-[calc(100vh-var(--nav-height-sm))] lg:min-h-[calc(100vh-var(--nav-height-lg))] pb-[var(--mobi-bottom-nav-height)]"
    >
      <slot />
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>
