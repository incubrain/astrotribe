<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { BaseBookmark } from '~/types/bookmark'

interface Props {
  bookmark: BaseBookmark
  selectable?: boolean
  isSelected?: boolean
}

const props = defineProps<Props>()
defineEmits<{
  (e: 'select', id: string): void
}>()

const bookmarkStore = useBookmarkStore()

const isBookmarked = computed(() =>
  bookmarkStore.isBookmarked(props.bookmark.content_id, props.bookmark.content_type),
)

const handleBookmark = async () => {
  try {
    await bookmarkStore.handleToggleBookmark({
      id: props.bookmark.content_id,
      type: props.bookmark.content_type,
      title: props.bookmark.metadata.title,
      url: props.bookmark.metadata.url,
      description: props.bookmark.metadata.description,
      thumbnail: props.bookmark.metadata.featured_image,
      author: props.bookmark.metadata.author,
    })
  } catch (error) {
    console.error('Error handling bookmark:', error)
  }
}

const handleDoiClick = () => {
  if (props.bookmark.metadata.doi_url) {
    window.open(props.bookmark.metadata.doi_url, '_blank', 'noopener,noreferrer')
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
    <div
      v-if="selectable"
      class="absolute w-full h-10 inset-0 z-10 flex items-start justify-end p-2 bg-black/5"
      :class="[isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity']"
    >
      <PrimeCheckbox
        :model-value="isSelected"
        :binary="true"
        @update:model-value="$emit('select', bookmark.id)"
      />
    </div>

    <div
      class="p-4 flex flex-col justify-between h-full"
      :class="{ 'opacity-75': isSelected }"
    >
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
            useTimeAgo(bookmark.metadata.published_at || bookmark.created_at).value
          }}</span>
        </div>

        <h2 class="text-xl font-bold mb-2">{{ bookmark.metadata.title }}</h2>

        <!-- Additional metadata -->
        <div
          v-if="
            bookmark.metadata.author || bookmark.metadata.published_in || bookmark.metadata.category
          "
          class="flex items-center text-sm mb-4 text-gray-500"
        >
          <template v-if="bookmark.metadata.author">
            <span>{{ bookmark.metadata.author }}</span>
          </template>
          <template v-if="bookmark.metadata.published_in">
            <span>{{ bookmark.metadata.published_in }}</span>
          </template>
          <template v-if="bookmark.metadata.category">
            <span>{{ bookmark.metadata.category }}</span>
          </template>
        </div>
      </div>

      <!-- Body -->
      <div>
        <div
          v-if="bookmark.metadata.featured_image"
          class="mb-4"
        >
          <NuxtImg
            :provider="bookmark.metadata.featured_image ? 'supabase' : undefined"
            :src="bookmark.metadata.featured_image || 'fallback-image.jpg'"
            :alt="bookmark.metadata.title"
            class="w-full h-auto rounded-lg"
            width="400"
            height="200"
          />
        </div>

        <p
          v-if="bookmark.metadata.description"
          class="text-sm text-gray-600 mb-4 line-clamp-3"
        >
          {{ bookmark.metadata.description }}
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Icon
              v-if="bookmark.metadata.doi_url"
              name="mdi:file-document-outline"
              size="20px"
              class="text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="handleDoiClick"
            />
            <span
              v-if="bookmark.metadata.score"
              class="text-sm text-gray-500"
            >
              Score: {{ bookmark.metadata.score }}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="hover:text-gray-600"
              @click="handleBookmark"
            >
              <Icon
                :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                size="20px"
                :class="{ 'text-primary-500': isBookmarked }"
              />
            </button>
            <NuxtLink
              :to="bookmark.metadata.url"
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
