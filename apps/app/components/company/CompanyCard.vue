<script setup lang="ts">
import { ref } from 'vue'

interface SocialMedia {
  id: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  instagram_url: string
  youtube_url: string
}

interface Props {
  company: {
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
  mode?: 'grid' | 'list'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view', company: any): void
  (e: 'bookmark', company: any): void
  (e: 'tag', tag: string): void
}>()

const isHovered = ref(false)
const fallbackImage = '/images/companies_fallback.png'
const image = ref(props.company.logo_url || fallbackImage)

// Method to change the image source to the fallback
const onError = () => {
  image.value = fallbackImage
}

// Handle various actions
const viewCompanyDetails = () => {
  emit('view', props.company)
}

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

// Trim description to a specific length
const trimmedDescription = computed(() => {
  if (!props.company.description) return ''

  const maxLength = props.mode === 'list' ? 300 : 150
  if (props.company.description.length <= maxLength) {
    return props.company.description
  }

  return props.company.description.substring(0, maxLength) + '...'
})

// Handle tag click
const handleTagClick = (tag: string, event: Event) => {
  event.stopPropagation()
  emit('tag', tag)
}
</script>

<template>
  <!-- Grid mode (card) -->
  <div
    v-if="mode === 'grid'"
    class="group relative h-full bg-primary-900/20 border border-primary-800/50 rounded-lg overflow-hidden hover:border-primary-600/50 transition-all duration-300 cursor-pointer"
    @click="viewCompanyDetails"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Government badge -->
    <div
      v-if="company.is_government"
      class="absolute top-2 right-2 z-10 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30"
    >
      Government
    </div>

    <!-- Image section -->
    <div class="h-40 relative overflow-hidden">
      <div class="absolute inset-0 bg-primary-800/50 flex items-center justify-center">
        <img
          :src="image"
          :alt="company.name"
          class="w-full h-full object-contain p-4"
          @error="onError"
        />
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-primary-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Content section -->
    <div class="p-4 space-y-4">
      <div>
        <h3 class="font-bold text-lg text-white mb-1 line-clamp-1">{{ company.name }}</h3>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-if="company.category"
            class="text-xs bg-primary-800/70 text-primary-300 px-2 py-1 rounded-full"
          >
            {{ company.category }}
          </span>
          <span
            v-if="company.founding_year"
            class="text-xs bg-primary-800/70 text-gray-300 px-2 py-1 rounded-full"
          >
            Est. {{ company.founding_year }}
          </span>
        </div>
        <p
          v-if="company.city || company.country"
          class="flex items-center text-xs text-gray-400 mb-2"
        >
          <Icon
            name="mdi:map-marker"
            class="mr-1 w-4 h-4 text-gray-500"
          />
          {{ company.city ? `${company.city}, ` : '' }}{{ company.country }}
        </p>
      </div>

      <p class="text-sm text-gray-300 line-clamp-3">{{ trimmedDescription }}</p>

      <!-- Keywords/Tags -->
      <div
        v-if="company.keywords && company.keywords.length"
        class="flex flex-wrap gap-1"
      >
        <button
          v-for="keyword in company.keywords.slice(0, 3)"
          :key="keyword"
          class="text-xs bg-primary-800/50 hover:bg-primary-700/50 text-gray-300 px-2 py-0.5 rounded-full transition-colors"
          @click="handleTagClick(keyword, $event)"
        >
          {{ keyword }}
        </button>
        <span
          v-if="company.keywords.length > 3"
          class="text-xs text-gray-400"
        >
          +{{ company.keywords.length - 3 }} more
        </span>
      </div>

      <!-- Footer with links -->
      <div class="flex justify-between items-center pt-2 mt-auto">
        <div class="flex space-x-1">
          <NuxtLink
            v-for="(url, key) in company.social_media || {}"
            v-show="url && key !== 'id' && ['linkedin_url', 'twitter_url'].includes(key)"
            :key="key"
            :to="url"
            target="_blank"
            external
            class="p-1.5 bg-primary-800/50 hover:bg-primary-700/50 rounded-full transition-colors"
            @click.stop
          >
            <Icon
              :name="getIcon(key)"
              size="16px"
              class="text-white"
            />
          </NuxtLink>
        </div>

        <NuxtLink
          v-if="company.job_url"
          :to="company.job_url"
          target="_blank"
          external
          class="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full transition-colors"
          @click.stop
        >
          Jobs
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- List mode -->
  <div
    v-else
    class="group w-full bg-primary-900/20 border border-primary-800/50 rounded-lg overflow-hidden hover:border-primary-600/50 transition-all duration-300 cursor-pointer flex"
    @click="viewCompanyDetails"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Image section -->
    <div class="w-32 h-32 relative overflow-hidden flex-shrink-0">
      <div class="absolute inset-0 bg-primary-800/50 flex items-center justify-center">
        <img
          :src="image"
          :alt="company.name"
          class="w-full h-full object-contain p-4"
          @error="onError"
        />
      </div>
    </div>

    <!-- Content section -->
    <div class="p-4 flex-grow space-y-2">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-lg text-white line-clamp-1">{{ company.name }}</h3>
            <div
              v-if="company.is_government"
              class="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30"
            >
              Government
            </div>
          </div>

          <div class="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <div
              v-if="company.founding_year"
              class="flex items-center gap-1"
            >
              <Icon
                name="mdi:calendar"
                class="w-4 h-4 text-gray-500"
              />
              Est. {{ company.founding_year }}
            </div>

            <div
              v-if="company.city || company.country"
              class="flex items-center gap-1"
            >
              <Icon
                name="mdi:map-marker"
                class="w-4 h-4 text-gray-500"
              />
              {{ company.city ? `${company.city}, ` : '' }}{{ company.country }}
            </div>

            <div
              v-if="company.category"
              class="flex items-center gap-1"
            >
              <Icon
                name="mdi:tag-outline"
                class="w-4 h-4 text-gray-500"
              />
              {{ company.category }}
            </div>
          </div>
        </div>

        <div class="flex space-x-1">
          <NuxtLink
            v-for="(url, key) in company.social_media || {}"
            v-show="url && key !== 'id'"
            :key="key"
            :to="url"
            target="_blank"
            external
            class="p-1.5 bg-primary-800/50 hover:bg-primary-700/50 rounded-full transition-colors"
            @click.stop
          >
            <Icon
              :name="getIcon(key)"
              size="16px"
              class="text-white"
            />
          </NuxtLink>
        </div>
      </div>

      <p class="text-sm text-gray-300">{{ trimmedDescription }}</p>

      <!-- Keywords/Tags -->
      <div
        v-if="company.keywords && company.keywords.length"
        class="flex flex-wrap gap-1"
      >
        <button
          v-for="keyword in company.keywords.slice(0, 5)"
          :key="keyword"
          class="text-xs bg-primary-800/50 hover:bg-primary-700/50 text-gray-300 px-2 py-0.5 rounded-full transition-colors"
          @click="handleTagClick(keyword, $event)"
        >
          {{ keyword }}
        </button>
        <span
          v-if="company.keywords.length > 5"
          class="text-xs text-gray-400"
        >
          +{{ company.keywords.length - 5 }} more
        </span>
      </div>

      <!-- Footer -->
      <div
        v-if="company.url || company.job_url"
        class="flex gap-2 pt-2"
      >
        <NuxtLink
          v-if="company.url"
          :to="company.url"
          target="_blank"
          external
          class="text-xs bg-primary-800/50 hover:bg-primary-700/50 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
          @click.stop
        >
          <Icon
            name="mdi:web"
            class="w-3 h-3"
          />
          Website
        </NuxtLink>

        <NuxtLink
          v-if="company.job_url"
          :to="company.job_url"
          target="_blank"
          external
          class="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
          @click.stop
        >
          <Icon
            name="mdi:briefcase-outline"
            class="w-3 h-3"
          />
          Jobs
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
