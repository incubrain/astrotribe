<template>
  <div class="w-full h-screen flex foreground relative overflow-hidden">
    <NavAppSidebar class="w-full h-full max-w-[10%] min-w-[240px] hidden lg:flex" />

    <div class="w-full h-full pb-[var(--mobi-bottom-nav-height)] relative flex flex-col">
      <NavAppTop />
      <div class="mx-auto md:p-4 xl:p-8 overflow-scroll">
        <slot />
      </div>
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>
