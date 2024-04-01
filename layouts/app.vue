<template>
  <div class="w-full h-screen flex foreground relative overflow-hidden">
    <NavSidebar class="w-full h-full max-w-[10%] min-w-[240px] hidden lg:flex" />

    <div
      class="w-full h-full mx-auto md:p-4 xl:p-8 pb-[var(--mobi-bottom-nav-height)] overflow-scroll"
    >
      <slot />
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>
