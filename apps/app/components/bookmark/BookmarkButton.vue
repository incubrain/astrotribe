<!-- components/BookmarkButton.vue -->
<script setup lang="ts">
interface Props {
  content: any
}

const props = defineProps<Props>()
const bookmarkStore = useBookmarkStore()

// Add more defensive checks for content properties
const contentId = computed(() => props.content?.id)
const contentType = computed(() => props.content?.content_type || 'news')

// Check if bookmarked, supporting the new content structure with extra error handling
const bookmarked = computed(() => {
  if (!contentId.value) return false
  return bookmarkStore.isBookmarked(contentId.value, contentType.value)
})

const showFeedback = ref(false)
const fadeOutComplete = ref(true)

const handleClick = async () => {
  if (!contentId.value) {
    console.error('Cannot bookmark: content has no ID')
    return
  }

  try {
    await bookmarkStore.handleToggleBookmark(props.content)
    showFeedback.value = true
    fadeOutComplete.value = false

    setTimeout(() => {
      showFeedback.value = false
    }, 1500)
  } catch (error) {
    console.error('Failed to toggle bookmark:', error)
  }
}
</script>

<template>
  <div class="relative">
    <!-- Floating feedback text -->
    <Transition @after-leave="fadeOutComplete = true">
      <div
        v-if="showFeedback"
        class="floating-feedback absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold"
      >
        <span class="golden-text">BOOKMARKED!</span>
        <div class="sparkles"></div>
      </div>
    </Transition>

    <!-- Bookmark button -->
    <button
      class="hover:text-primary-600 flex items-center justify-center h-full"
      @click="handleClick"
    >
      <Icon
        :name="bookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
        size="20px"
        :class="[
          { 'text-amber-500': bookmarked },
          'transition-all duration-300',
          'hover:scale-110',
          'active:scale-95',
        ]"
      />
    </button>
  </div>
</template>

<style scoped>
.floating-feedback {
  animation: floatUp 1.5s ease-out forwards;
  pointer-events: none;
}

.golden-text {
  background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

.sparkles {
  position: absolute;
  inset: -5px -10px;
  z-index: -1;
}

.sparkles::before,
.sparkles::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fbbf24;
  animation: sparkle 1s ease-in-out infinite;
  box-shadow:
    0 0 3px #fbbf24,
    0 0 6px #fbbf24,
    0 0 9px #fbbf24;
}

.sparkles::before {
  left: 20%;
  animation-delay: -0.4s;
}

.sparkles::after {
  right: 20%;
  animation-delay: -0.2s;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -5px) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -15px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px) scale(0.8);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.3) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Additional sparkles using pseudo-elements on floating-feedback */
.floating-feedback::before,
.floating-feedback::after {
  content: '✦';
  position: absolute;
  color: #fbbf24;
  font-size: 12px;
  opacity: 0;
  animation: floatingSparkle 1.5s ease-out forwards;
}

.floating-feedback::before {
  left: -15px;
  animation-delay: 0.2s;
}

.floating-feedback::after {
  right: -15px;
  animation-delay: 0.4s;
}

@keyframes floatingSparkle {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(0deg);
  }
  30% {
    opacity: 1;
    transform: translate(-5px, -5px) rotate(45deg);
  }
  70% {
    opacity: 1;
    transform: translate(-10px, -10px) rotate(90deg);
  }
  100% {
    opacity: 0;
    transform: translate(-15px, -15px) rotate(180deg);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
