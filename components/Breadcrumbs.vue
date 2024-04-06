<script lang="ts" setup>
const links = useBreadcrumbItems()
</script>

<template>
  <PrimeBreadcrumb
    :model="links"
    :pt="{
      root: 'foreground'
    }"
  />
</template>

<style></style>
