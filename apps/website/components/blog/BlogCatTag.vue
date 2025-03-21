<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { PropType } from 'vue'

// Define types for both old and new content structures
type OldArticleTagT = {
  name: string
}

type NewArticleTagT = {
  name: string
  description?: string
  color?: string
  stem?: string
}

type OldArticleCategoryT = {
  name: string
  slug: string
}

// New category type with Tailwind color field
type NewArticleCategoryT = {
  name: string
  description?: string
  color?: string
  stem?: string
}

// Union type for tags - can be string ID, old tag format, or new tag format
type ArticleTagT = string | OldArticleTagT | NewArticleTagT

// Union type for categories - can be string ID, old category format, or new category format
type ArticleCategoryT = string | OldArticleCategoryT | NewArticleCategoryT

const props = defineProps({
  tags: {
    type: Array as PropType<ArticleTagT[]>,
    required: false,
    default: () => [],
  },
  category: {
    type: [String, Object] as PropType<ArticleCategoryT>,
    required: false,
    default: null,
  },
})

// Check if tags array is valid and not empty
const hasTags = computed(() => {
  return Array.isArray(props.tags) && props.tags.length > 0
})

// Fetch tag data for each tag ID - only if we have tags
const { data: tagData } = await useAsyncData('tag-data', async () => {
  // If no tags, return empty map
  if (!hasTags.value) return new Map()

  const tagDataMap = new Map()

  // Process tags that are just string IDs
  const stringTagIds = props.tags?.filter((tag) => typeof tag === 'string') as string[]
  if (stringTagIds.length) {
    const tagDataResults = await Promise.all(
      stringTagIds.map((tagId) => queryCollection('tags').where('stem', '=', tagId).first()),
    )

    // Add results to the map
    tagDataResults.forEach((data, index) => {
      if (data) {
        tagDataMap.set(stringTagIds[index], data)
      }
    })
  }

  return tagDataMap
})

// Type guard to check if a tag is in the old format
const isOldTagFormat = (tag: ArticleTagT): tag is OldArticleTagT => {
  return typeof tag === 'object' && tag !== null && 'name' in tag && !('color' in tag)
}

// Type guard to check if a tag is in the new format
const isNewTagFormat = (tag: ArticleTagT): tag is NewArticleTagT => {
  return (
    typeof tag === 'object' &&
    tag !== null &&
    'name' in tag &&
    ('color' in tag || 'description' in tag)
  )
}

// Type guard to check if a category is in the old format
const isOldCategoryFormat = (category: ArticleCategoryT): category is OldArticleCategoryT => {
  return (
    typeof category === 'object' &&
    category !== null &&
    'slug' in category &&
    'name' in category &&
    !('color' in category)
  )
}

// Type guard to check if a category is in the new format
const isNewCategoryFormat = (category: ArticleCategoryT): category is NewArticleCategoryT => {
  return (
    typeof category === 'object' &&
    category !== null &&
    'name' in category &&
    ('color' in category || 'description' in category)
  )
}

// Get tag details regardless of format
const getTagDetails = (tag: ArticleTagT) => {
  // Case 1: New format tag object
  if (isNewTagFormat(tag)) {
    return {
      name: tag.name,
      tailwindColor: tag.color ? `bg-${tag.color}` : 'bg-gray-500',
    }
  }

  // Case 2: Old format tag object
  if (isOldTagFormat(tag)) {
    return {
      name: tag.name,
      tailwindColor: 'bg-gray-500', // Default for old format
    }
  }

  // Case 3: String ID with fetched data
  if (typeof tag === 'string' && tagData.value?.has(tag)) {
    const data = tagData.value.get(tag)
    return {
      name: data.name,
      tailwindColor: data.color ? `bg-${data.color}` : 'bg-gray-500',
    }
  }

  // Case 4: Just a string ID without fetched data
  return {
    name: typeof tag === 'string' ? tag : 'Unknown',
    tailwindColor: 'bg-gray-500',
  }
}

// Get category details including name and color
const getCategoryDetails = computed(() => {
  const category = props.category
  if (!category) return { name: '', tailwindColor: 'bg-primary-500' }

  // Case 1: New format with complete category object and Tailwind color
  if (isNewCategoryFormat(category)) {
    return {
      name: category.name,
      tailwindColor: category.color ? `bg-${category.color}` : 'bg-primary-500',
    }
  }

  // Case 2: Old format with name and slug
  if (isOldCategoryFormat(category)) {
    return {
      name: category.name,
      tailwindColor: legacySlugToTailwind(category.slug),
    }
  }

  // Case 3: Just a string ID
  return {
    name: category,
    tailwindColor: legacySlugToTailwind(category),
  }
})

// Legacy function to convert old slug to Tailwind class
function legacySlugToTailwind(slug: string): string {
  switch (slug) {
    case 'people-of-space':
      return 'bg-blue-600'
    case 'sustainable-development':
      return 'bg-amber-600'
    case 'space-exploration':
      return 'bg-purple-600'
    case 'dark-sky-conservation':
      return 'bg-blue-800'
    default:
      return 'bg-primary-500'
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-4">
      <!-- Category Badge -->
      <span
        v-if="category"
        class="px-3 py-1 rounded-full text-white text-xs font-medium"
        :class="getCategoryDetails.tailwindColor"
      >
        {{ useChangeCase(getCategoryDetails.name, 'capitalCase').value }}
      </span>

      <!-- Tag Badges - Only render if we have tags -->
      <template v-if="hasTags">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="px-3 py-1 rounded-full text-white text-xs font-medium"
          :class="getTagDetails(tag).tailwindColor"
        >
          {{ useChangeCase(getTagDetails(tag).name, 'capitalCase').value }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
