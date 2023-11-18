import type { NewsType } from '@/types/news'

export default defineEventHandler(async () => {
  try {
    // ${scraperBlogs[0].name}
    const storage = useStorage('blogs')
    const blogsFile = await storage.getItem<NewsType[]>('summary-test.json')
    return {
      status: 200,
      message: 'Blogs retrieved',
      blogs: blogsFile
    }
  } catch (error: any) {
    console.error('get-blogs error', error.message)
    return {
      status: 500,
      message: 'Error retrieving blogs',
      error
    }
  }
})
