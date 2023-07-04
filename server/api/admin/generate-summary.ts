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
    beginner: string
    intermediate: string
    expert: string
  }
}

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<Post[]>('summary-test.json')
    let test
    if (!blogs) throw new Error('No blogs found')
    for (const blog of blogs) {
      console.log('call generateResponse')
      const intermediateSummary = await generateResponse(blog.content, 'intermediateSummary')
      console.log('intermediateSummary', intermediateSummary)
      test = intermediateSummary
    }
    return {
      status: 200,
      message: 'Blogs retrieved',
      blogs: test
    }
  } catch (error: any) {
    console.log('generate-summary error', error.message)
    return {
      status: 500,
      message: 'Error summarising blogs',
      error
    }
  }
})
