<!-- components/NewsActions.vue -->
<script setup lang="ts">
interface Props {
  score: number
  commentsCount?: number
  bookmarked: boolean
  url: string
  content: any // Updated to accept any content from the unified content table
  onSourceVisit: () => Promise<void>
  cardSide: 'front' | 'back'
}

defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'border-t border-primary-900 pt-4': cardSide === 'back' }"
  >
    <div class="flex items-center gap-4">
      <div
        :class="[
          'flex items-center justify-center py-1 px-2 rounded-xl',
          cardSide === 'front' ? 'bg-primary-950' : 'bg-primary-900',
        ]"
      >
        <VoteButton
          :content-id="content.id"
          :content-type="content.content_type || 'news'"
          direction="up"
          :card-side="cardSide"
        />
        <span class="text-sm font-medium pl-1 pr-2">{{ score }}</span>
        <VoteButton
          :content-id="content.id"
          :content-type="content.content_type || 'news'"
          direction="down"
          :card-side="cardSide"
        />
      </div>
      <!-- <button
        v-if="commentsCount"
        class="flex items-center gap-2 hover:text-primary-600"
        @click="$emit('open-modal', 'Comments')"
      >
        <Icon
          name="mdi:comment-outline"
          size="20px"
        />
        <span v-if="cardSide === 'back' && commentsCount">{{ commentsCount }}</span>
      </button> -->
    </div>
    <div class="flex items-center gap-2 justify-center">
      <BookmarkButton :content="content" />
      <NuxtLink
        :to="url"
        target="_blank"
        rel="noopener noreferrer nofollow"
        :class="[
          'hover:text-primary-600',
          cardSide === 'back'
            ? 'flex items-center gap-1.5 group p-1 rounded-full bg-primary-500'
            : '',
        ]"
        @click="onSourceVisit"
      >
        <Icon
          name="mdi:link-variant"
          size="20px"
        />
      </NuxtLink>
    </div>
  </div>
</template>
