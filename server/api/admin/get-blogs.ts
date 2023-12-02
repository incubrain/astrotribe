import type { NewsType } from '@/types/news'

export default defineEventHandler(async () => {
  try {
    // !todo: this should be a database call
    // use the summary-test.json file as reference for the database structure
    const storage = useStorage('blogs')
    const blogsFile = await storage.getItem<NewsType[]>('blogsData')
    console.log('get-blogs start')
    console.log(blogsFile)

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
