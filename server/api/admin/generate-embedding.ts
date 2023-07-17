import { News } from '@/types/zod/news'

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<News[]>('summary-test.json')
    if (!blogs) throw createError('No blogs found')
    for (let i = 0; i < blogs.length; i++) {
      console.log('call generateEmbeddings')
      if (blogs[i].raw.body === undefined) throw createError('Error no raw body')
      const embeddings = await generateEmbeddings(blogs[i].raw.body)
      console.log('embeddings', embeddings)
      if (embeddings === undefined) throw createError('Error generating embedding')
      blogs[i].embedding = embeddings
    }

    // Update the blogs in the storage
    await storage.setItem('summary-test.json', blogs)

    return {
      status: 200,
      message: 'Blogs retrieved and embeddings generated',
      blogs
    }
  } catch (error: any) {
    console.log('generate-embedding error', error.message)
    return {
      status: 500,
      message: 'Error generating embeddings for blogs',
      error
    }
  }
})
