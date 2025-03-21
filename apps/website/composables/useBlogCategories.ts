// composables/useBlogCategories.ts
import { ref, computed } from 'vue'

export function useBlogCategories() {
  const categories = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  // Initialize with an empty array
  const validCategories = computed(() => {
    const result = ['all', ...(categories.value?.map((cat) => cat?.stem || '') || [])]
    console.log('Computed validCategories:', result)
    return result
  })

  // Function to get category info by slug
  const getCategoryInfo = (slug) => {
    console.log(`Getting info for category: ${slug}`)

    if (slug === 'all') {
      return {
        title: 'All Articles',
        description: 'Explore all our blog posts across various categories',
      }
    }

    console.log('Current categories:', categories.value)

    // Try to find the category with the full slug first
    let category = categories.value?.find((cat) => cat?.stem === slug)

    // If not found, try without the 'categories/' prefix
    if (!category && slug.indexOf('categories/') !== 0) {
      const fullSlug = `categories/${slug}`
      category = categories.value?.find((cat) => cat?.stem === fullSlug)
    }

    // If still not found, try with the plain slug portion
    if (!category && slug.indexOf('categories/') === 0) {
      const plainSlug = slug.replace('categories/', '')
      category = categories.value?.find((cat) => cat?.stem.endsWith(plainSlug))
    }

    console.log('Found category:', category)

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
  // Function to get category image
  const getCategoryImage = (slug: string) => {
    // Add more defensive coding
    if (!slug) return '/images/blog/categories/fallback.webp'
    return `/images/blog/categories/${slug}.webp`
  }

  // We'll use this to fetch from the categories collection
  const fetchCategories = async () => {
    console.log('Fetching categories...')

    try {
      isLoading.value = true
      const data = await queryCollection('categories').all()
      console.log('Categories fetched:', data)

      categories.value = data || []
      isLoading.value = false
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err
      isLoading.value = false
      categories.value = [] // Ensure categories is always an array
    }
  }

  // Return fetch method so it can be called when needed
  return {
    categories: computed(() => categories.value || []),
    isLoading,
    error,
    validCategories,
    getCategoryInfo,
    getCategoryImage,
    fetchCategories, // Return the function instead of calling it immediately
  }
}
