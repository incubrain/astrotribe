<script setup lang="ts">
import localCompanies from '@/supabase/seed/companies.json'
const companiesStore = useCompaniesStore()
const { companies } = storeToRefs(companiesStore)

const haveCompanies = computed(() => companiesStore !== null && companiesStore.length > 0)

const paginationStore = usePaginationStore()
// blog_url: 'https://agnikul.in/#/news', // external blogs, just title, link and description
// jobs_page_url: 'https://agnikul.in/#/career', // annoying dropdowns to select job type and job, no clear date

const fetchInput = ref({
  storeKey: 'companiesStore',
  endpoint: '/api/companies/select/many',
  criteria: {
    dto: 'select:company:card',
    pagination: paginationStore.getPaginationRange('companiesStore')
  }
})

watchEffect(() => {
  if (haveCompanies.value === false) {
    console.log('Fetching companies')
    companiesStore.loadCompanies(fetchInput.value)
  }
})

definePageMeta({ name: 'Companies', layout: 'app' })
</script>

<template>
  <div>
    <div class="w-full">
      <!-- <PrimeButton @click="companiesStore.insertCompany(firstCompany)"> Add Company </PrimeButton> -->
    </div>
    <BaseInfiniteScroll
      store-key="companiesStore"
      :pagination="{
        page: 1,
        limit: 10
      }"
      @update:scroll-end="companiesStore.loadCompanies(fetchInput)"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8">
        <CompanyCard
          v-for="(company, i) in localCompanies"
          :key="`companies-post-${i}`"
          :company="company"
        />
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
