<script setup lang="ts">
// const { data: jobs, status } = await useAsyncData('jobs-all', () => queryCollection('jobs').all())

const { store, loadMore } = useSelectData('jobs', {
  columns: '*, companies(name)',
  orderBy: { column: 'published_at', ascending: false },
  pagination: {
    page: 1,
    limit: 20,
  },
  initialFetch: true,
  storeKey: 'jobsFeed',
})

const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

const isUserBasic = profile.value.user_plan === 'free'
const showDialog = ref(isUserBasic)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchFuseOptions = {
  keys: ['title', 'description', 'companies.name', 'location', 'employment_type'],
  threshold: 0.3,
  shouldSort: true,
}

const handleSearchResults = (results: FuseResult<any>[]) => {
  console.log('Search results:', results)
  searchResults.value = results.map((result) => result.item)
}

const { items } = storeToRefs(store)

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const jobs = computed(() =>
  items.value
    .map((item) => {
      return {
        ...item,
        publishedAt: item.published_at && formatDate(item.published_at),
        expiresAt: item.expires_at && formatDate(item.expires_at),
        employmentType: item.employment_type,
        company: item.companies?.name,
      }
    })
    .sort((a, b) => {
      if (a.publish_date === null) return 1 // Move null to the bottom
      if (b.publish_date === null) return -1 // Move null to the bottom

      return new Date(b.published_at) - new Date(a.published_at) // Sort descending
    }),
)

const filters = ref({
  location: { value: '', options: [] },
  company: { value: '', options: [] },
  type: { value: '', options: [] },
  minSalary: 0,
  tags: [] as string[],
})

watch(jobs, (newJobs) => {
  filters.value.location.options = [...new Set(newJobs?.map((job) => job.location))]
  filters.value.company.options = [...new Set(newJobs?.map((job) => job.companies?.name))]
  filters.value.type.options = [...new Set(newJobs?.map((job) => job.employment_type))]
})

const filteredJobs = computed(() => {
  if (!jobs.value) return []

  return jobs.value.filter((job) => {
    const matchesSearch =
      !searchQuery.value ||
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuesry.value.toLowerCase())

    const matchesType =
      !filters.value.type.value ||
      job.employment_type.toLowerCase().includes(filters.value.type.value.toLowerCase())

    const matchesCompany =
      !filters.value.company.value ||
      job.companies?.name.toLowerCase().includes(filters.value.company.value.toLowerCase())

    const matchesLocation =
      !filters.value.location.value ||
      job.location.toLowerCase().includes(filters.value.location.value.toLowerCase())

    return matchesSearch && matchesLocation && matchesType && matchesCompany
  })
})

const addTagFilter = (tag: string) => {
  if (!filters.value.tags.includes(tag)) {
    filters.value.tags.push(tag)
  }
}

const removeTagFilter = (tag: string) => {
  filters.value.tags = filters.value.tags.filter((t) => t !== tag)
}
</script>

<template>
  <div
    :class="{ 'h-full overflow-hidden blur-sm pointer-events-none': isUserBasic }"
    @wheel="(event) => isUserBasic && event.preventDefault()"
    @touchmove="(event) => isUserBasic && event.preventDefault()"
  >
    <!-- Hero Section -->
    <HomeHero
      v-model:search-query="searchQuery"
      @add-tag="addTagFilter"
    />

    <!-- Main content -->
    <div class="flex flex-col gap-2 max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center rounded bg-primary-600 text-white p-2 w-max">
        <Icon
          size="24px"
          name="mdi:exclamation"
        />
        <h2>We are in the process of adding more companies. Thank you for your patience.</h2>
      </div>
      <!-- Filters -->
      <div class="w-full">
        <FuzzySearch
          v-model="searchQuery"
          :data="jobs"
          :fuse-options="searchFuseOptions"
          placeholder="Search jobs..."
          class="w-full"
          @results="handleSearchResults"
        />
      </div>
      <div class="mb-8">
        <JobFilter
          v-model="filters"
          @remove-tag="removeTagFilter"
        />
      </div>

      <!-- Job listings -->
      <Transition
        name="fade"
        mode="out-in"
      >
        <IBInfiniteScroll
          :threshold="1400"
          @update:scroll-end="loadMore"
        >
          <JobListing
            :jobs="filteredJobs"
            :loading="false"
            @filter-tag="addTagFilter"
          />
        </IBInfiniteScroll>
      </Transition>
    </div>
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

<style>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-grid-white {
  mask-image: linear-gradient(to bottom, transparent, black, transparent);
}

/* Map styles */
.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  filter: grayscale(100%) brightness(105%) contrast(90%);
}

/* Hide map controls */
.leaflet-control-container {
  display: none;
}

/* Hide marker shadow */
.leaflet-shadow-pane {
  display: none;
}

/* Entry animation for elements */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

/* Controls customization */
.leaflet-control-zoom {
  border: none !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.leaflet-control-zoom a {
  color: white !important;
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.leaflet-control-zoom a:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Marker customization */
.leaflet-marker-icon {
  filter: invert(1) brightness(1.5);
}

/* Enhanced glassmorphism effect */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 12px 40px 0 rgba(0, 0, 0, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* Search field enhancement */
input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

input:focus::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

/* Gradient animation for title */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
