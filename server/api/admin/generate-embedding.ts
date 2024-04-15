import type { NewsCardT } from '@/types/news'

export default defineEventHandler(async () => {
  // !important: ignore this step for now
  try {
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<NewsCardT[]>('summary-test.json')
    if (!blogs) throw createError({ message: 'No blogs found'})
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].raw.body === undefined) throw createError({ message: 'Error no raw body'})
      const embeddings = await generateEmbeddings(blogs[i].raw.body)
      if (embeddings === undefined) throw createError({ message: 'Error generating embedding'})
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
    console.error('generate-embedding error', error.message)
    return {
      status: 500,
      message: 'Error generating embeddings for blogs',
      error
    }
  }
})
