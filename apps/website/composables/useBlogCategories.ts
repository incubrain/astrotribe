// composables/useBlogCategories.ts
import { ref, computed } from 'vue'

interface BlogCategory {
  stem: string
  name: string
  description?: string
}

export function useBlogCategories(initialCategories: Ref<BlogCategory[] | null>) {
  const categories = ref<BlogCategory[]>(initialCategories.value || [])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Normalized category slugs (no prefix)
  const validCategories = computed(() => {
    return ['all', ...categories.value.map((cat) => cat?.stem?.replace(/^categories\//, '') || '')]
  })

  const getCategoryInfo = (slug: string) => {
    const normalizedSlug = slug.startsWith('categories/') ? slug : `categories/${slug}`
    const category = categories.value.find((cat) => cat?.stem === normalizedSlug)

    console.log('getCategoryInfo', slug, category)

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
    categories,
    validCategories,
    isLoading,
    error,
    getCategoryInfo,
    getCategoryImage,
  }
}
