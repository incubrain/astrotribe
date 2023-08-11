<template>
  <div class="w-full lg:grid-cols-[minmax(240px,10%)_minmax(600px,100%)] lg:grid">
    <NavTop class="lg:col-start-1 lg:col-span-2" />

    <NavSidebar
      class="lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:row-span-1 flex w-full h-full"
    />
    <AppBody
      class="lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:row-span-1"
      :mobi-bottom-nav="true"
    >
      <div class="w-full mx-auto md:p-4 xl:p-8">
        <slot />
      </div>
    </AppBody>
    <NavMobiBottom class="lg:hidden" />
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
