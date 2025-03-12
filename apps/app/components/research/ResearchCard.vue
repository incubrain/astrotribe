<template>
  <div class="rounded-md border border-color background flex flex-col justify-between">
    <div>
      <div class="space-y-3 p-4">
        <div class="flex gap-2">
          <span class="text-sm w-auto">
            {{ useTimeAgo(research.published_at ?? research.created_at).value }}
          </span>
        </div>
        <h4 class="text-balance text-xl"> {{ research.title.slice(0, 120) }}... </h4>
        <p
          v-if="research.description"
          class="text-sm"
        >
          {{ research.description.slice(0, 360) }}...
        </p>
      </div>
    </div>
    <div class="p-4 flex justify-end items-center">
      <NuxtLink
        :to="getResearchUrl()"
        target="_blank"
        rel="noopener"
      >
        <PrimeButton
          label="Read on Axive"
          size="small"
          outlined
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Updated to use the new unified content structure
defineProps({ research: { type: Object, required: true } })

// Helper to get URL based on the new structure
function getResearchUrl() {
  const research = props.research

  // Check if the URL is in the standard field or in details JSONB
  let url = research.url

  if (!url && research.details?.url) {
    url = research.details.url
  }

  // Add version if available
  const version = research.details?.version || research.version
  if (url && version) {
    return `${url}v${version}`
  }

  return url || '#'
}
</script>
