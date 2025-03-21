// composables/useBlogCategories.ts
import { ref, computed } from 'vue'

export function useBlogCategories() {
  const categories = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  // Initialize with an empty array
  const validCategories = computed(() => {
    return ['all', ...(categories.value?.map((cat) => cat?.stem || '') || [])]
  })

  // Function to get category info by slug
  const getCategoryInfo = (slug) => {
    if (slug === 'all') {
      return {
        title: 'All Articles',
        description: 'Explore all our blog posts across various categories',
      }
    }

    const category = categories.value?.find((cat) => cat?.stem === slug)
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
  const getCategoryImage = (slug) => {
    // Add more defensive coding
    return '/images/blog/category-default.jpg'
  }

  // We'll use this to fetch from the categories collection
  const fetchCategories = async () => {
    try {
      isLoading.value = true
      const data = await queryCollection('categories').all()
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
