// import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { SupabaseClient, type PostgrestSingleResponse } from '@supabase/supabase-js'
import type { NewsType } from '@/types/news'

export const useNewsStore = defineStore('news', () => {
  const posts = ref([] as NewsType[])
  const summaryLevel = ref('beginner' as 'beginner' | 'intermediate' | 'expert')
  const isModalOpen = ref(false)
  const currentIndex = ref(0)
  const client: SupabaseClient = useNuxtApp().$supabase

  const previousIndex = computed(() => (currentIndex.value > 0 ? currentIndex.value - 1 : 0))
  const nextIndex = computed(() =>
    currentIndex.value < posts.value.length - 1 ? currentIndex.value + 1 : currentIndex.value
  )

  const currentPost = computed(() => posts.value[currentIndex.value])
  const nextPost = computed(() => posts.value[nextIndex.value])
  const previousPost = computed(() => posts.value[previousIndex.value])

  const getBlogs = async () => {
    const res = (await client.from('articles').select('*')) as PostgrestSingleResponse<NewsType[]>
    console.log('res:', res.data)

    posts.value = res.data
  }

  const scrapeBlogs = async () => {
    try {
      const { data, error } = await useAsyncData('news', () => $fetch('/api/admin/scrape-blogs'))
      if (error.value) throw new Error('error getting blogs: ' + error.value)
      const scrapedData = data._rawValue.posts[0]
      console.log('scrapedData:', scrapedData)
      const articleData = {
        title: scrapedData.title,
        link: scrapedData.link,
        author: scrapedData.author,
        original: scrapedData.body,
        published: scrapedData.published,
        images: scrapedData.images
      }
      await client.from('articles').insert([articleData])
    } catch (error: any) {
      console.log('scrape-blogs error', error.message)
      return {
        status: 500,
        message: 'Error scraping blogs',
        error
      }
    }
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
