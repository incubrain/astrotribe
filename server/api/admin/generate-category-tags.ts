import { NewsGenerate } from '@/types/news'

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('blogs')
    const blogs = await storage.getItem<NewsGenerate[]>('summary-test.json')
    if (!blogs) throw createError('No blogs found')

    for (let i = 0; i < blogs.length; i++) {
      console.log('call generateCategoryTags')
      if (blogs[i].raw.body === undefined)
        throw createError('Error no body for generating category and tags')

      const categoryTags = await generateCategoryTags(blogs[i].raw.body)
      console.log('Category and Tags', categoryTags)
      if (categoryTags === undefined) throw createError('Error generating category and tags')

      blogs[i].category = categoryTags.category
      blogs[i].tags = categoryTags.tags
    }

    // Update the blogs in the storage
    await storage.setItem('summary-test.json', blogs)

    return {
      status: 200,
      message: 'Blogs retrieved and category/tags generated',
      blogs
    }
  } catch (error: any) {
    console.log('generate-category-tags error', error.message)
    return {
      status: 500,
      message: 'Error categorizing and tagging blogs',
      error
    }
  }
})