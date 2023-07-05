interface Post {
  title: {
    name: string
    link: string
  }
  author: {
    name: string
    link: string
  }
  published: {
    name: string
    link: string
  }
  category: {
    name: string
    link: string
  }
  content: string
  featured_image: string | null
  summaries: {
    beginner: string[]
    intermediate: string[]
    expert: string[]
  }
}

export default defineEventHandler(async () => {
  try {
    // ${scraperBlogs[0].name}
    const storage = useStorage('blogs')
    const blogsFile = await storage.getItem<Post[]>('summary-test.json')
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
