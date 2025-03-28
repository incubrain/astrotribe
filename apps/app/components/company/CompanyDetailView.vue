<script setup lang="ts">
import { ref, watch } from 'vue'

interface SocialMedia {
  id: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  instagram_url: string
  youtube_url: string
}

interface Company {
  id: string
  founding_year: number
  name: string
  description: string
  logo_url: string
  url: string
  is_government: boolean
  keywords: Array<string>
  category?: string
  city?: string
  country?: string
  social_media?: SocialMedia
  job_url?: string
}

interface Props {
  company: Company
  visible: boolean
}

const props = defineProps<Props>()
const localVisible = ref(props.visible)

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  },
)
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'bookmark', company: Company): void
}>()

const isBookmarked = ref(false) // This would be connected to a store in a real implementation

const close = () => {
  localVisible.value = false
  emit('update:visible', false)
}

const active = ref('about')
const tabs = [
  { key: 'about', label: 'About', icon: 'mdi:information-outline' },
  { key: 'jobs', label: 'Jobs', icon: 'mdi:briefcase-outline' },
  { key: 'news', label: 'News', icon: 'mdi:newspaper-variant-outline' },
  { key: 'social', label: 'Social', icon: 'mdi:account-group-outline' },
]

const getIcon = (key: string) => {
  if (key.includes('email')) {
    return 'mdi:email'
  } else if (key.includes('youtube')) {
    return 'mdi:youtube'
  } else if (key.includes('facebook')) {
    return 'mdi:facebook'
  } else if (key.includes('twitter')) {
    return 'mdi:twitter'
  } else if (key.includes('linkedin')) {
    return 'mdi:linkedin'
  } else if (key.includes('instagram')) {
    return 'mdi:instagram'
  } else {
    return ''
  }
}

// Mock data for demonstration purposes
const relatedCompanies = ref([
  { id: '1', name: 'SpaceX', category: 'Launch Provider' },
  { id: '2', name: 'Blue Origin', category: 'Launch Provider' },
  { id: '3', name: 'Rocket Lab', category: 'Launch Provider' },
])

const recentNews = ref([
  { id: '1', title: 'New rocket launch scheduled', date: '2025-02-15' },
  { id: '2', title: 'Company announces funding round', date: '2025-01-20' },
  { id: '3', title: 'New technology patent filed', date: '2024-12-10' },
])

const openJobs = ref([
  { id: '1', title: 'Aerospace Engineer', location: 'Houston, TX' },
  { id: '2', title: 'Software Developer', location: 'Remote' },
])
</script>

<template>
  <PrimeDialog
    v-model:visible="localVisible"
    modal
    :style="{ width: '90vw', maxWidth: '1200px' }"
    :draggable="false"
    :closable="true"
    :pt="{
      closeButton: 'text-white hover:text-primary-300',
      header: 'bg-primary-900 border-b border-primary-700',
      content: 'bg-primary-900 p-0',
    }"
    @update:visible="close"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-8">
        <h2 class="text-xl font-bold text-white">{{ company.name }}</h2>
        <button
          class="p-2 rounded-full hover:bg-primary-800/50"
          :title="isBookmarked ? 'Remove bookmark' : 'Bookmark company'"
          @click="toggleBookmark"
        >
          <Icon
            :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
            class="w-5 h-5"
            :class="isBookmarked ? 'text-primary-400' : 'text-white'"
          />
        </button>
      </div>
    </template>

    <div class="flex flex-col md:flex-row min-h-[70vh]">
      <!-- Left sidebar with company info -->
      <div class="w-full md:w-1/3 p-6 border-r border-primary-800 space-y-6">
        <div class="flex flex-col items-center text-center">
          <div
            class="w-32 h-32 rounded-full overflow-hidden bg-primary-800/50 flex items-center justify-center mb-4"
          >
            <img
              :src="company.logo_url || '/images/companies_fallback.png'"
              :alt="company.name"
              class="w-full h-full object-contain"
              @error="$event.target.src = '/images/companies_fallback.png'"
            />
          </div>

          <h3 class="text-xl font-bold text-white">{{ company.name }}</h3>

          <div class="flex items-center justify-center space-x-2 mt-2">
            <PrimeTag
              :value="company.is_government ? 'Government' : 'Private'"
              :severity="company.is_government ? 'info' : 'success'"
            />
            <PrimeTag
              v-if="company.category"
              :value="company.category"
              severity="warning"
            />
          </div>

          <div class="mt-4">
            <NuxtLink
              v-if="company.url"
              :to="company.url"
              target="_blank"
              external
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <Icon
                name="mdi:web"
                class="w-5 h-5"
              />
              Visit Website
            </NuxtLink>
          </div>
        </div>

        <div class="space-y-4 border-t border-primary-800 pt-4">
          <div
            v-if="company.founding_year"
            class="flex items-center gap-3"
          >
            <Icon
              name="mdi:calendar"
              class="w-5 h-5 text-primary-400"
            />
            <div>
              <p class="text-sm text-gray-400">Founded in</p>
              <p class="font-medium">{{ company.founding_year }}</p>
            </div>
          </div>

          <div
            v-if="company.city || company.country"
            class="flex items-center gap-3"
          >
            <Icon
              name="mdi:map-marker"
              class="w-5 h-5 text-primary-400"
            />
            <div>
              <p class="text-sm text-gray-400">Location</p>
              <p class="font-medium"
                >{{ company.city ? `${company.city}, ` : '' }}{{ company.country }}</p
              >
            </div>
          </div>

          <div
            v-if="company.social_media"
            class="border-t border-primary-800 pt-4"
          >
            <p class="text-sm text-gray-400 mb-2">Connect</p>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="(url, key) in company.social_media"
                v-show="url && key !== 'id'"
                :key="key"
                :to="url"
                target="_blank"
                external
                class="p-2 bg-primary-800 hover:bg-primary-700 rounded-full transition-colors"
              >
                <Icon
                  :name="getIcon(key)"
                  size="20px"
                  class="text-white"
                />
              </NuxtLink>
            </div>
          </div>

          <div
            v-if="company.keywords && company.keywords.length"
            class="border-t border-primary-800 pt-4"
          >
            <p class="text-sm text-gray-400 mb-2">Keywords</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="keyword in company.keywords"
                :key="keyword"
                class="px-2 py-1 bg-primary-800/50 rounded-full text-xs"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <div class="w-full md:w-2/3 flex flex-col">
        <!-- Tabs navigation -->
        <div class="flex border-b border-primary-800">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-6 py-4 flex items-center gap-2 transition-colors"
            :class="
              active === tab.key
                ? 'border-b-2 border-primary-500 text-primary-400'
                : 'text-gray-400 hover:text-white hover:bg-primary-800/30'
            "
            @click="active = tab.key"
          >
            <Icon
              :name="tab.icon"
              class="w-5 h-5"
            />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab content -->
        <div class="p-6 flex-grow overflow-auto">
          <!-- About tab -->
          <div
            v-if="active === 'about'"
            class="space-y-6"
          >
            <div>
              <h3 class="text-lg font-semibold mb-3">About</h3>
              <p class="text-gray-300">{{ company.description }}</p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-3">Related Companies</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="relatedCompany in relatedCompanies"
                  :key="relatedCompany.id"
                  class="p-4 bg-primary-800/30 border border-primary-800 rounded-lg flex items-center gap-3 hover:border-primary-700 transition-colors cursor-pointer"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-primary-700/30 flex items-center justify-center"
                  >
                    <Icon
                      name="mdi:office-building"
                      class="w-6 h-6 text-primary-400"
                    />
                  </div>
                  <div>
                    <h4 class="font-medium">{{ relatedCompany.name }}</h4>
                    <p class="text-sm text-gray-400">{{ relatedCompany.category }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jobs tab -->
          <div
            v-else-if="active === 'jobs'"
            class="space-y-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Open Positions</h3>
              <NuxtLink
                v-if="company.job_url"
                :to="company.job_url"
                target="_blank"
                external
                class="text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <span>View all</span>
                <Icon
                  name="mdi:arrow-right"
                  class="w-5 h-5"
                />
              </NuxtLink>
            </div>

            <div
              v-if="openJobs.length"
              class="space-y-4"
            >
              <div
                v-for="job in openJobs"
                :key="job.id"
                class="p-4 bg-primary-800/30 border border-primary-800 rounded-lg hover:border-primary-700 transition-colors cursor-pointer"
              >
                <div class="flex justify-between">
                  <div>
                    <h4 class="font-medium">{{ job.title }}</h4>
                    <p class="text-sm text-gray-400">{{ job.location }}</p>
                  </div>
                  <Icon
                    name="mdi:arrow-right"
                    class="w-5 h-5 text-primary-400"
                  />
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center py-8 text-gray-400"
            >
              <Icon
                name="mdi:briefcase-outline"
                class="w-12 h-12 mx-auto mb-4 opacity-50"
              />
              <p>No open positions available</p>
            </div>
          </div>

          <!-- News tab -->
          <div
            v-else-if="active === 'news'"
            class="space-y-6"
          >
            <h3 class="text-lg font-semibold mb-3">Latest News</h3>

            <div
              v-if="recentNews.length"
              class="space-y-4"
            >
              <div
                v-for="news in recentNews"
                :key="news.id"
                class="p-4 bg-primary-800/30 border border-primary-800 rounded-lg hover:border-primary-700 transition-colors cursor-pointer"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium">{{ news.title }}</h4>
                    <p class="text-sm text-gray-400">{{
                      new Date(news.date).toLocaleDateString()
                    }}</p>
                  </div>
                  <Icon
                    name="mdi:arrow-right"
                    class="w-5 h-5 text-primary-400"
                  />
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center py-8 text-gray-400"
            >
              <Icon
                name="mdi:newspaper-variant-outline"
                class="w-12 h-12 mx-auto mb-4 opacity-50"
              />
              <p>No recent news</p>
            </div>
          </div>

          <!-- Social tab -->
          <div
            v-else-if="active === 'social'"
            class="space-y-6"
          >
            <h3 class="text-lg font-semibold mb-3">Social Media</h3>

            <div
              v-if="
                company.social_media &&
                Object.keys(company.social_media).some(
                  (key) => key !== 'id' && company.social_media[key],
                )
              "
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <NuxtLink
                v-for="(url, key) in company.social_media"
                v-show="url && key !== 'id'"
                :key="key"
                :to="url"
                target="_blank"
                external
                class="p-4 bg-primary-800/30 border border-primary-800 rounded-lg hover:border-primary-700 transition-colors flex items-center gap-3"
              >
                <Icon
                  :name="getIcon(key)"
                  size="24px"
                  class="text-primary-400"
                />
                <div>
                  <h4 class="font-medium capitalize">{{ key.replace('_url', '') }}</h4>
                  <p class="text-sm text-gray-400 truncate">{{ url }}</p>
                </div>
              </NuxtLink>
            </div>

            <div
              v-else
              class="text-center py-8 text-gray-400"
            >
              <Icon
                name="mdi:account-group-outline"
                class="w-12 h-12 mx-auto mb-4 opacity-50"
              />
              <p>No social media profiles available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PrimeDialog>
</template>
