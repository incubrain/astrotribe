<template>
  <div class="w-full h-full flex min-h-[calc(100vh-var(--nav-height-sm))] lg:min-h-[calc(100vh-var(--nav-height-lg))]">
    <NavSidebar
      class="w-full min-h-full max-w-[10%] min-w-[240px]"
    />

    <div class="w-full mx-auto md:p-4 xl:p-8">
      <slot />
    </div>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>
