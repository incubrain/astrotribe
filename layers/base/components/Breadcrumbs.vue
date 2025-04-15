<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
// need to fix usage
</script>

<template>
  <PrimeBreadcrumb
    v-if="breadcrumbs.length"
    :model="breadcrumbs"
    :pt="{
      root: 'foreground p-0 flex items-center justify-start',
      menu: '!mb-0',
    }"
  >
    <template #item="{ item }">
      <NuxtLink :to="item.to">
        <span
          class="text-primary font-semibold"
          :class="item.current ? 'link-active' : ''"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </template>
  </PrimeBreadcrumb>
</template>
