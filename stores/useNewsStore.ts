import type { NewsCardT } from '@/types/news'

export const useNewsStore = defineStore('news', () => {
  const posts = ref([] as NewsCardT[])
  const summaryLevel = ref('beginner' as 'beginner' | 'intermediate' | 'expert')
  const isModalOpen = ref(false)
  const currentIndex = ref(0)

  const previousIndex = computed(() => (currentIndex.value > 0 ? currentIndex.value - 1 : 0))
  const nextIndex = computed(() =>
    currentIndex.value < posts.value.length - 1 ? currentIndex.value + 1 : currentIndex.value
  )

  const currentPost = computed(() => posts.value[currentIndex.value])
  const nextPost = computed(() => posts.value[nextIndex.value])
  const previousPost = computed(() => posts.value[previousIndex.value])

  const getBlogs = async () => {
    const { data, error } = await useFetch('/api/admin/get-news')
    console.log(data, error)

    if (error.value) throw new Error('error getting blogs: ' + error.value)
    posts.value = data.value.news
  }

  const getSummary = async () => {
    const { data, error } = await useAsyncData('summary', () =>
      $fetch('/api/admin/generate-summary')
    )
    if (error.value) throw new Error('error getting summary: ' + error.value)
    // assuming that data.value.blogs is the summary
    // summary.value = data.value.blogs
  }

  const changeSummaryLevel = (level: 'beginner' | 'intermediate' | 'expert') => {
    summaryLevel.value = level
  }

  const toggleModal = (postIndex?: number) => {
    isModalOpen.value = !isModalOpen.value
    if (postIndex !== undefined) {
      currentIndex.value = postIndex
    }
  }

  const next = () => {
    if (currentIndex.value < posts.value.length - 1) {
      currentIndex.value++
    }
  }

  const previous = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  return {
    posts,
    summaryLevel,
    isModalOpen,
    currentIndex,
    previousIndex,
    nextIndex,
    currentPost,
    nextPost,
    previousPost,
    getBlogs,
    scrapeBlogs,
    getSummary,
    changeSummaryLevel,
    toggleModal,
    next,
    previous
  }
})
