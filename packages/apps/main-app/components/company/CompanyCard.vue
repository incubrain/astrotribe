<script setup lang="ts">
defineProps({
  company: {
    type: Object as () => {},
    required: true,
  },
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
  <div class="border-color border-b-2 px-4 py-8">
    <div>
      <div class="space-y-4 pb-4">
        <div class="flex items-center gap-4">
          <IBImage
            v-if="company.logo_url"
            class="border-color rounded-full border"
            :img="{
              src: `companies/${company.logo_url}`,
              width: '60',
              height: '60',
            }"
          />
          <div>
            <h3 class="text-balance text-xl font-semibold md:max-h-16">
              {{ company.name }}
            </h3>
            <p
              v-if="company.category_id !== 16"
              class="text-sm"
            >
              {{ getCategoryName(company.category_id) }}
            </p>
          </div>
          <!-- <span class="text-sm w-auto">
            Scraped: {{ useTimeAgo(company.scraped_at).value }}
          </span> -->
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <PrimeTag severity="info">
          {{ company.is_government ? 'Government' : 'Private' }}
        </PrimeTag>
        <PrimeTag
          v-if="company.founding_year"
          severity="info"
        >
          founded: {{ company.founding_year }}
        </PrimeTag>
        <IBNewLabel
          :date="company.created_at!"
          :max-age="14"
        />
      </div>
      <p
        v-if="company.description"
        class="text-sm"
      >
        {{ company.description }}
      </p>
      <div class="flex w-full items-center justify-between pt-4">
        <div>
          <IBSocialBlock
            v-if="company.social_media"
            :socials="company.social_media"
          />
        </div>
        <NuxtLink
          :to="company.url"
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
