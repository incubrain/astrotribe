import { News } from '@/types/news'

export default defineEventHandler(async () => {
  try {
    // ${scraperBlogs[0].name}
    const storage = useStorage('blogs')
    const blogsFile = await storage.getItem<News[]>('summary-test.json')
    return {
      status: 200,
      message: 'Blogs retrieved',
      blogs: blogsFile
    }
  } catch (error: any) {
    console.log('get-blogs error', error.message)
    return {
      status: 500,
      message: 'Error retrieving blogs',
      error
    }
  }
})
