<script lang="ts" setup>
import { gsap } from 'gsap'

defineProps({
  bookmarks: {
    type: Array as PropType<Bookmark[]>,
    required: true,
  },
  isSelected: {
    type: Function as PropType<(id: string) => boolean>,
    required: true,
  },
  toggleSelection: {
    type: Function as PropType<(id: string) => void>,
    required: true,
  },
})

const positions = new Map()

const getPosition = (el: Element) => {
  const { top, left, width, height } = el.getBoundingClientRect()
  return { top, left, width, height }
}

const beforeLeave = (el: Element) => {
  const pos = getPosition(el)
  positions.set(el, pos)
  el.style.position = 'absolute'
  el.style.top = pos.top + 'px'
  el.style.left = pos.left + 'px'
  el.style.width = pos.width + 'px'
  el.style.height = pos.height + 'px'
}

const leave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    onComplete: done,
  })
}

const enter = (el: Element, done: () => void) => {
  gsap.from(el, {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    onComplete: done,
  })
}

const afterEnter = (el: Element) => {
  el.style.removeProperty('position')
  el.style.removeProperty('top')
  el.style.removeProperty('left')
  el.style.removeProperty('width')
  el.style.removeProperty('height')
}
</script>

<template>
  <TransitionGroup
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
    tag="div"
    :css="false"
    @before-leave="beforeLeave"
    @leave="leave"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <div
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :data-index="bookmark.id"
      class="relative group transition-all duration-300"
    >
      <BookmarkCard
        :bookmark="bookmark"
        :selectable="true"
        :is-selected="isSelected(bookmark.id)"
        class="h-full w-full"
        @select="toggleSelection"
      />
    </div>
  </TransitionGroup>
</template>
