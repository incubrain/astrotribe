<script setup lang="ts">
definePageMeta({ name: 'Companies' })

const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

const isUserBasic = profile.value.user_plan === 'free'
const showDialog = ref(isUserBasic)
const loading = useLoadingStore()

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchFuseOptions = {
  keys: ['name', 'description', 'categories.name', 'founding_year'],
  threshold: 0.3,
  shouldSort: true,
}

const handleSearchResults = (results: FuseResult<any>[]) => {
  console.log('Search results:', results)
  searchResults.value = results.map((result) => result.item)
}

// Ads integration
const { isLoading: adsLoading } = useAdsStore()

const { store, loadMore } = useSelectData('companies', {
  orderBy: { column: 'logo_url', ascending: true },
  columns: `id, name, description, logo_url, founding_year, url, is_government, category, keywords, job_url,
  social_media(id, facebook_url, linkedin_url, twitter_url, instagram_url, youtube_url),
  addresses(id, countries(name), cities(name))`,
  pagination: {
    page: 1,
    limit: 20,
  },
  filters: { content_status: { eq: 'published' } },
  initialFetch: true,
  storeKey: 'companiesFeed',
})

const handleScroll = () => {
  if (!isUserBasic) loadMore()
}

const { items } = storeToRefs(store)

const companies = computed(() =>
  items.value.map((company) => ({
    ...company,
    city: company.addresses?.[0]?.cities?.name,
    country: company.addresses?.[0]?.countries?.name,
    category: company.categories?.name,
  })),
)

const showSkeletonGrid = computed(() => loading.isLoading('companiesFeed') || adsLoading.value)

const filteredCompanies = computed(() => {
  let filtered = companies.value ?? []

  // Filter by search
  if (searchQuery.value && searchResults.value?.length) {
    return searchResults.value
  }

  return filtered
})
</script>

<template>
  <div
    :class="{ 'h-full overflow-hidden blur-sm pointer-events-none': isUserBasic }"
    @wheel="(event) => isUserBasic && event.preventDefault()"
    @touchmove="(event) => isUserBasic && event.preventDefault()"
  >
    <div class="w-full">
      <FuzzySearch
        v-model="searchQuery"
        :data="companies"
        :fuse-options="searchFuseOptions"
        placeholder="Search companies..."
        class="w-full"
        @results="handleSearchResults"
      />
    </div>
    <Transition
      name="fade"
      mode="out-in"
    >
      <IBInfiniteScroll
        v-if="!showSkeletonGrid"
        :threshold="1400"
        :disabled="isUserBasic"
        @update:scroll-end="handleScroll"
      >
        <CompaniesTable :companies="filteredCompanies" />
      </IBInfiniteScroll>
      <CompaniesSkeleton v-else />
    </Transition>
  </div>
  <PrimeDialog
    v-model:visible="showDialog"
    :modal="true"
    header="🚀 Upgrade Your Plan"
    class="w-[80vw] md:w-[30vw] rounded-md"
  >
    <div class="flex flex-col items-center gap-4 p-6 text-center">
      <!-- Upgrade Icon -->
      <Icon
        name="mdi:crown"
        size="48px"
        class="text-yellow-500"
      />

      <!-- Upgrade Message -->
      <h3 class="text-lg font-semibold text-white"> Unlock Premium Features! </h3>
      <p class="text-white text-sm">
        Upgrade your plan to access all companies and premium insights.
      </p>

      <!-- Buttons -->
      <div class="flex gap-3 mt-4">
        <NuxtLink to="/settings/payments">
          <PrimeButton
            severity="success"
            class="px-6 py-2 flex items-center gap-2"
          >
            <Icon
              name="mdi:star"
              size="20px"
              class="text-yellow-400"
            />
            Upgrade Now
          </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </PrimeDialog>
</template>
