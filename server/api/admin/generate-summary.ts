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
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<Post[]>('summary-test.json')
    if (!blogs) throw new Error('No blogs found')
    for (let i = 0; i < blogs.length; i++) {
      console.log('call generateSummary')
      const summaries = await generateSummary(blogs[i].content)
      console.log('Summaries', summaries)
      if (summaries !== undefined) {
        blogs[i].summaries = {
          beginner: summaries.beginner,
          intermediate: summaries.intermediate,
          expert: summaries.expert
        }
      } else {
        throw new Error('Error generating summaries')
      }
    }

    // Update the blogs in the storage
    await storage.setItem('summary-test.json', blogs)

    return {
      status: 200,
      message: 'Blogs retrieved and summaries generated',
      blogs
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
