<script setup lang="ts">
const companiesStore = useCompaniesStore()
const { companies } = storeToRefs(companiesStore)

const haveCompanies = computed(() => companies !== null && companies.length > 0)

const paginationStore = usePaginationStore()

// 'Residential',
//  'Headquarters',
//  'Office',
//  'Factory',
//  'Lab',
//  'Warehouse',
//  'R&D',
//  'Retail',
//  'Showroom',
//  'Branch'

const firstCompany = {
  name: 'Agnikul Cosmos',
  description:
    'Agnikul Cosmos is a space tech company building small satellite launch vehicles. We are building a full stack launch vehicle to take small satellites to space.',
  founding_year: 2017,
  logo_url: 'https://agnikul.in/static/media/logo.4d8e7f0d.png',
  website_url: 'https://agnikul.in/#/',
  blog_url: 'https://agnikul.in/#/news', // external blogs, just title, link and description
  jobs_page_url: 'https://agnikul.in/#/career', // annoying dropdowns to select job type and job, no clear date
  is_government: false,
  category_id: 1,
  last_scraped_at: new Date(),
  scrape_frequency: 'BiWeekly',
  contacts: [
    {
      type: 'Recruitment',
      name: 'Srinath Ravichandran',
      email: 'humancapital@agnikul.in'
    },
    {
      type: 'Company',
      name: 'Srinath Ravichandran',
      is_primary: true,
      email: 'curious@agnikul.in',
      phone: '+91 72472 46334'
    }
  ],
  addresses: [
    {
      name: 'Agnikul Cosmos Private Limited.',
      street1: 'Rocket Factory, IIT Madras Research Park',
      street2: '1st Floor, A-Block',
      city: 'Chennai',
      state: 'Kerala',
      country: 'India',
      postal_code: '600113',
      address_type: 'Factory',
      is_primary: false
    },
    {
      name: 'Agnikul Cosmos Launch Vehicles Private Limited',
      street1: 'Kerala Startup Mission, Technopark',
      street2: 'Thejaswini, G3B, Technopark Rd, Karyavattom',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      is_primary: true,
      address_type: 'Headquarters',
      postal_code: '695581'
    }
  ],
  social_media: {
    linkedin_url: 'https://www.linkedin.com/company/agnikul-cosmos/',
    twitter_url: 'https://twitter.com/@agnikulcosmos',
    instagram_url: 'https://instagram.com/agnikul/',
    youtube_url: 'https://www.youtube.com/@agnikulcosmos1404/videos'
  }
}

const fetchInput = ref({
  storeKey: 'companiesStore',
  endpoint: '/api/companies/many',
  criteria: {
    dto: 'select:company:card',
    pagination: paginationStore.getPaginationRange('companiesStore')
  }
})

// watchEffect(() => {
//   if (haveCompanies.value === false) {
//     console.log('Fetching companies')
//     companiesStore.loadCompanies(fetchInput.value)
//   }
// })

definePageMeta({ name: 'Companies', layout: 'app' })
</script>

<template>
  <div>
    <div class="w-full">
      <PrimeButton @click="companiesStore.insertCompany(firstCompany)"> Add Company </PrimeButton>
    </div>
    <BaseInfiniteScroll
      store-key="companiesStore"
      :pagination="{
        page: 1,
        limit: 10
      }"
    >
      <!-- @update:scroll-end="companiesStore.loadCompanies(fetchInput)" -->
      <div
        v-if="haveCompanies"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
      >
        <CompanyCard
          v-for="(company, i) in companies"
          :key="`companies-post-${i}`"
          :company="company"
        />
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
