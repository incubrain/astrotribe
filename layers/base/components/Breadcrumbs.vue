<script lang="ts" setup>
const route = useRoute()

const generateBreadcrumbs = (path: string) => {
  const pathParts = path.split('/').filter(Boolean)
  let currentPath = ''
  return pathParts.map((part) => {
    currentPath += `/${part}`
    return {
      to: currentPath,
      label: part.charAt(0).toUpperCase() + part.slice(1),
      ariaLabel: part.charAt(0).toUpperCase() + part.slice(1),
    }
  })
}

const links = computed(() => generateBreadcrumbs(route.path))

// Prepare links by filtering and adjusting labels
const formattedLinks = computed(() => {
  if (!links.value) return []
  console.log('Formatting links', links.value)
  return links.value
    .map((link) => {
      if (!link) return null // Skip if link is undefined or null

      // Filter out the home link if in app route
      if (link.to === '/') {
        console.log('Filtering out home link', link)
        return null
      }

      // Special handling for the 'astrotribe' path
      if (link.to === '/') {
        return { ...link, label: 'Home', ariaLabel: 'Home' }
      }

      if (link.to === '/ask') {
        return { ...link, label: 'Q&A', ariaLabel: 'Q&A' }
      }

      return link // Return unmodified link
    })
    .filter(Boolean) // Remove null entries
})
</script>

<template>
  <PrimeBreadcrumb
    v-if="formattedLinks.length"
    :model="formattedLinks"
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

<style></style>
