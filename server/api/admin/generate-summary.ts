import { NewsGenerate } from '@/types/zod/news'

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<NewsGenerate[]>('summary-test.json')
    if (!blogs) throw createError('No blogs found')
    for (let i = 0; i < blogs.length; i++) {
      console.log('call generateSummary')
      if (blogs[i].raw.body === undefined) throw createError('Error no body for generating summaries')
      const summaries = await generateSummary(blogs[i].raw.body)
      console.log('Summaries', summaries)
      if (summaries === undefined) throw createError('Error generating summaries')
      blogs[i].summary = {
        beginner: summaries.beginner,
        intermediate: summaries.intermediate,
        expert: summaries.expert
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
