<script lang="ts" setup>
const links = useBreadcrumbItems()

const isAppRoute = useRoute().path.includes('/astrotribe')

const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)

// Prepare links by filtering and adjusting labels
const formattedLinks = computed(() => {
  if (!links.value) return []
  console.log('Formatting links', links.value)
  return links.value
    .map((link) => {
      if (!link) return null // Skip if link is undefined or null

      if (!isAppRoute) {
        return link // Return original link if not in app route
      }

      // Filter out the home link if in app route
      if (link.to === '/') {
        console.log('Filtering out home link', link)
        return null
      }

      // Special handling for the 'astrotribe' path
      if (link.to === '/astrotribe') {
        return { ...link, label: 'Home', ariaLabel: 'Home' }
      }

      if (link.to === '/astrotribe/ask') {
        return { ...link, label: 'Q&A', ariaLabel: 'Q&A' }
      }

      if (link.label.toLowerCase().replaceAll(' ', '-') === profile.value?.user_id) {
        console.log('userIdReplace', link)
        return {
          ...link,
          label: profile.value.given_name,
          ariaLabel: profile.value.given_name,
        }
      }

      return link // Return unmodified link
    })
    .filter(Boolean) // Remove null entries
})
</script>

<template>
  <PrimeBreadcrumb
    v-if="formattedLinks"
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
