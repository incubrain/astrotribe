<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'


interface Props {
  bookmark: NormalizedBookmark
}

const props = defineProps<Props>()
const { isNewsBookmarked, toggleBookmark } = useBookmarks()

const bookmarked = computed(() => isNewsBookmarked.value(props.bookmark.content_id))

const handleBookmark = async () => {
  try {
    await toggleBookmark({
      id: props.bookmark.content_id,
      type: props.bookmark.content_type,
    })
  } catch (error) {
    console.error('Error handling bookmark:', error)
  }
}

const contentTypeIcon = computed(() => {
  switch (props.bookmark.content_type) {
    case 'news':
      return 'mdi:newspaper'
    case 'research':
      return 'mdi:file-document'
    case 'newsletters':
      return 'mdi:email-newsletter'
    case 'companies':
      return 'mdi:domain'
    default:
      return 'mdi:bookmark'
  }
})


</script>

<template>
  <div class="rounded-lg relative border border-color w-full h-full">
    <div class="p-4 flex flex-col justify-between h-full">
      <!-- Header -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <Icon
              :name="contentTypeIcon"
              size="20px"
              class="text-primary-500"
            />
            <span class="text-sm capitalize">{{ bookmark.content_type }}</span>
          </div>
          <span class="text-sm text-gray-500">{{
            useTimeAgo(bookmark.published_at || bookmark.created_at).value
          }}</span>
        </div>

        <h2 class="text-xl font-bold mb-2">{{ bookmark.title }}</h2>

        <!-- Additional metadata based on content type -->
        <div class="flex items-center text-sm mb-4 text-gray-500">
          <template v-if="bookmark.author">
            <span>{{ bookmark.author }}</span>
          </template>
          <template v-if="bookmark.published_in">
            <span>{{ bookmark.published_in }}</span>
          </template>
          <template v-if="bookmark.category">
            <span>{{ bookmark.category }}</span>
          </template>
        </div>
      </div>

      <!-- Body -->
      <div>
        <div
          v-if="bookmark.featured_image"
          class="mb-4"
        >
          <NuxtImg
            :provider="bookmark.featured_image ? 'supabase' : undefined"
            :src="bookmark.featured_image || 'fallback-image.jpg'"
            :alt="bookmark.title"
            class="w-full h-auto rounded-lg"
            width="400"
            height="200"
          />
        </div>

        <p
          v-if="bookmark.description"
          class="text-sm text-gray-600 mb-4 line-clamp-3"
        >
          {{ bookmark.description }}
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Icon
              v-if="bookmark.doi_url"
              name="mdi:file-document-outline"
              size="20px"
              class="text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="window.open(bookmark.doi_url, '_blank')"
            />
            <span
              v-if="bookmark.score"
              class="text-sm text-gray-500"
            >
              Score: {{ bookmark.score }}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="hover:text-gray-600"
              @click="handleBookmark"
            >
              <Icon
                :name="bookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                size="20px"
                :class="{ 'text-primary-500': bookmarked }"
              />
            </button>
            <NuxtLink
              :to="bookmark.url"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="hover:text-gray-600"
            >
              <Icon
                name="mdi:link-variant"
                size="20px"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
