// composables/useBlogCategories.ts
import { ref, computed } from 'vue'

export function useBlogCategories() {
  const categories = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Normalized category slugs (no prefix)
  const validCategories = computed(() => {
    return ['all', ...categories.value.map((cat) => cat?.stem?.replace(/^categories\//, '') || '')]
  })

  // Get category info by slug
  const getCategoryInfo = (slug: string) => {
    const normalizedSlug = slug.startsWith('categories/') ? slug : `categories/${slug}`
    const category = categories.value.find((cat) => cat?.stem === normalizedSlug)

    if (!category && slug === 'all') {
      return {
        title: 'All Articles',
        description: 'Explore all our blog posts across various categories',
      }
    }

    return category
      ? {
          title: category.name,
          description: category.description || `Articles about ${category.name}`,
        }
      : {
          title: 'Category',
          description: 'Blog posts in this category',
        }
  }

  // Get image path for category slug
  const getCategoryImage = (slug: string) => {
    if (!slug) return '/images/blog/categories/fallback.webp'
    return `/images/blog/categories/${slug}.webp`
  }

  return {
    categories: computed(() => categories.value),
    validCategories,
    isLoading,
    error,
    getCategoryInfo,
    getCategoryImage,
  }
}
