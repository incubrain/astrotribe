<script setup lang="ts">
// const domainKey = 'companies'
// const { store, loadMore } = await useSelectData<Companies>('companies', {
//   columns:
//     'id, name, description, logo_url, url, scrape_frequency, founding_year, created_at, updated_at, is_government, category_id, social_media_id, scrape_rating, content_status, scraped_at, keywords',
//   filters: { content_status: { eq: 'draft' } },
//   orderBy: { column: 'created_at', ascending: false },
//   initialFetch: true,
//   pagination: { page: 1, limit: 20 },
// })

// const { items: companies } = storeToRefs(store)

// const loading = useLoadingStore()
// const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({ name: 'Companies' })

</script>

<template>
  <CompaniesComingSoon />
  <!-- <div>
    <IBInfiniteScroll @update:scroll-end="loadMore">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]">
        <div class="mx-auto flex w-full max-w-sm flex-col md:col-start-2">
          <CompanyCard
            v-for="(company, i) in companies"
            :key="`companies-post-${i}`"
            :company="company"
          />
          <CompanyCardSkeleton v-show="isLoading" />
        </div>
        <IBAdvertisement />
      </div>
    </IBInfiniteScroll>
  </div> -->
</template>
