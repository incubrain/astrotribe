<script setup lang="ts">
// import type { TitleType } from '../../../base/types/content'

type AlignmentType = 'left' | 'center' | 'right'

const props = defineProps({
  title: {
    type: Object as PropType<TitleType>,
    required: true,
  },
  alignment: {
    type: String as PropType<AlignmentType>,
    default: 'left',
  },
  isCta: {
    type: Boolean,
    default: false,
  },
  labelWhite: {
    type: Boolean,
    default: false,
  },
  // New prop to control whether to split the title into regular and highlighted parts
  highlightLastWord: {
    type: Boolean,
    default: false,
  },

  dynamicStyling: {
    type: Boolean,
    default: false,
  },

  highlightIndex: {
    type: Number,
    default: -1, // -1 means use highlightLastWord logic
  },
})

const slots = useSlots()
const { conf } = useAnimation()

// Determine if title should have a highlighted part
const hasHighlightPart = computed(() => {
  return props.highlightLastWord && props.title.main && props.title.main.includes(' ')
})

// Get the first part of the title (before the last word if highlighting is enabled)
const getFirstPart = (text: string) => {
  if (!text) return ''

  if (props.highlightLastWord) {
    const words = text.split(' ')
    if (words.length <= 1) return text

    return words.slice(0, words.length - 1).join(' ') + ' '
  }

  return text
}

// Get the highlight part (last word if highlighting is enabled)
const getHighlightPart = (text: string) => {
  if (!text) return ''

  if (props.highlightLastWord) {
    const words = text.split(' ')
    if (words.length <= 1) return ''

    return words[words.length - 1]
  }

  return ''
}

const { personaStyles, activePersona } = usePersona()

// Update your title parsing logic to handle dynamic styling
const getTitleParts = computed(() => {
  if (!props.title.main) return { before: '', highlight: '', after: '' }

  // If not using dynamic styling, use the simple split logic
  if (!props.dynamicStyling) {
    if (props.highlightLastWord) {
      const words = props.title.main.split(' ')
      if (words.length <= 1) return { before: props.title.main, highlight: '', after: '' }

      return {
        before: words.slice(0, words.length - 1).join(' ') + ' ',
        highlight: words[words.length - 1],
        after: '',
      }
    }
    return { before: props.title.main, highlight: '', after: '' }
  }

  // For dynamic styling with persona
  const words = props.title.main.split(' ')
  if (words.length <= 1) return { before: props.title.main, highlight: '', after: '' }

  // Determine which word to highlight
  const index = props.highlightIndex >= 0 ? props.highlightIndex : words.length - 1

  if (index >= words.length) return { before: props.title.main, highlight: '', after: '' }

  return {
    before: index === 0 ? '' : words.slice(0, index).join(' ') + ' ',
    highlight: words[index],
    after: index < words.length - 1 ? ' ' + words.slice(index + 1).join(' ') : '',
  }
})

// Dynamic highlight style based on persona
const highlightStyle = computed(() => {
  return props.dynamicStyling
    ? personaStyles.value.sectionHeading
    : 'bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent'
})
</script>

<template>
  <div
    v-motion
    :initial="conf.sectionTitle.initial"
    :visibleOnce="{
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 20,
      },
    }"
    :class="`text-${alignment} max-w-xl pb-16 mx-auto`"
  >
    <div
      v-if="title.label"
      class="flex items-center gap-2 mb-3"
      :class="`justify-${alignment}`"
    >
      <div class="h-px w-8 bg-primary-600"></div>
      <span
        class="uppercase text-sm font-medium tracking-wider"
        :class="highlightStyle"
      >
        {{ title.label }}
      </span>
      <div
        v-if="alignment === 'center'"
        class="h-px w-8 bg-primary-600"
      ></div>
    </div>
    <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
      <span class="inline-block">{{ getTitleParts.before }}</span>
      <span
        v-if="getTitleParts.highlight"
        :class="highlightStyle"
        class="inline-block transition-colors duration-500"
      >
        {{ getTitleParts.highlight }}
      </span>
      <span
        v-if="getTitleParts.after"
        class="inline-block"
        >{{ getTitleParts.after }}</span
      >
    </h2>
    <p
      v-if="title.subtitle"
      class="text-xl text-gray-300"
    >
      {{ title.subtitle }}
    </p>
    <div
      v-if="slots.default"
      class="space-y-6 mt-6"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
