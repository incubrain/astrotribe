<script lang="ts" setup>
const links = useBreadcrumbItems()
</script>

<template>
  <UBreadcrumb
    :links="links"
    class="flex justify-start items-center"
    :ui="{
      ol: 'flex gap-2 items-center m-0'
    }"
  />
</template>

<style></style>
