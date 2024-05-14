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
  <div class="border-b-2 border-color px-4 py-8">
    <div>
      <div class="space-y-4 pb-4">
        <div class="flex gap-4 items-center">
          <BaseImage
            v-if="company.logo_url"
            :img="{
              src: `images/companies/${company.logo_url}`
            }"
            class="w-12 h-12 rounded-full border border-color"
          />
          <div>
            <h3 class="text-balance text-xl md:max-h-16 font-semibold">
              {{ company.name }}
            </h3>
            <p class="text-sm">
              {{ getCategoryName(company.category_id) }}
            </p>
          </div>
          <!-- <span class="text-sm w-auto">
            Scraped: {{ useTimeAgo(company.last_scraped_at).value }}
          </span> -->
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <PrimeTag
          v-if="company.founding_year"
          severity="info"
        >
          founded: {{ company.founding_year }}
        </PrimeTag>
        <PrimeTag severity="info">
          {{ company.is_government ? 'Government' : 'Private' }}
        </PrimeTag>
      </div>
      <p
        v-if="company.description"
        class="text-sm"
      >
        {{ company.description }}
      </p>
      <div class="w-full flex justify-between items-center pt-4">
        <div>
          <BaseSocialBlock
            v-if="company.social_media"
            :socials="company.social_media"
          />
        </div>
        <NuxtLink
          :to="company.website_url"
          target="_blank"
          rel="noopener"
        >
          <PrimeButton
            label="Website"
            size="small"
            outlined
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
