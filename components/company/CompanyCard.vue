<script setup lang="ts">
defineProps({
  company: {
    type: Object as () => {},
    required: true
  }
})

const { getCategoryName } = useCategoryTagStore()

// What to display:
// Company location(s)
// Category
// Tags?
// Name
// Link to website
// Number of news updates
// Scrape Frequency?
// Sector
// Founded Year
// Description - probably a summary of all articles by chatGPT
// Logo
// isHiring (check job board to see, maybe linkedin) - add later, just scrape Linkedin Jobs for now
// isFunded
// valuation
// companySize
// primaryLocation
// country
//
</script>

<template>
  <BaseHoverCard>
    <div>
      <div class="space-y-4">
        <div class="flex gap-4 items-center">
          <BaseImage
            v-if="company.logo_url"
            :img="{
              src: `images/companies/${company.logo_url}`
            }"
            class="w-12 h-12 rounded-full"
          />
          <PrimeTag>
            {{ getCategoryName(company.category_id) }}
          </PrimeTag>
          <!-- <span class="text-sm w-auto">
            Scraped: {{ useTimeAgo(company.last_scraped_at).value }}
          </span> -->
        </div>
      </div>
    </div>
    <div
      class="flex flex-col gap-2 pb-4 group-hover:max-h-none group-hover:overflow-scroll overflow-hidden"
    >
      <h4
        class="text-balance text-xl md:max-h-16 group-hover:max-h-none group-hover:overflow-visible overflow-hidden"
      >
        {{ company.name }}
      </h4>
      <p
        v-if="company.description"
        class="text-sm max-h-none md:max-h-4 overflow-hidden group-hover:max-h-none group-hover:overflow-visible"
      >
        {{ company.description }}
      </p>
      <NuxtLink
        :to="company.website_url"
        target="_blank"
        rel="noopener"
      >
        <PrimeButton
          label="Company Website"
          size="small"
          text
        />
      </NuxtLink>
    </div>
  </BaseHoverCard>
</template>
