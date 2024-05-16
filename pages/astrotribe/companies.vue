<script setup lang="ts">
const companiesStore = useCompaniesStore()
const { companies } = storeToRefs(companiesStore)
const domainKey = 'companies'

const haveCompanies = computed(() => companiesStore !== null && companiesStore.length > 0)

const fetchInput = ref({
  domainKey,
  endpoint: '/api/companies/select/cards',
  criteria: {
    dto: 'select:company:card',
  }
}) as Ref<FetchInput>

watchEffect(() => {
  if (haveCompanies.value === false) {
    console.log('Fetching companies')
    companiesStore.loadCompanies(fetchInput.value)
  }
})

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({ name: 'Companies', layout: 'app' })
</script>

<template>
  <div>
    <BaseInfiniteScroll
      :domain-key="domainKey"
      :pagination="{
        page: 1,
        limit: 20
      }"
      @update:scroll-end="companiesStore.loadCompanies(fetchInput)"
    >
      <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]">
        <BaseSidebar />
        <div class="flex flex-col max-w-sm md:col-start-2 mx-auto w-full">
          <CompanyCard
            v-for="(company, i) in companies"
            :key="`companies-post-${i}`"
            :company="company"
          />
          <CompanyCardSkeleton v-show="isLoading" />
        </div>
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
