// server/api/debug-content.ts
export default defineEventHandler(async (event) => {
  const blogItems = await queryCollection(event, 'blog').all()
  const contentItems = await queryCollection(event, 'content').all()

  return {
    blogCount: blogItems.length,
    contentCount: contentItems.length,
    blogPaths: blogItems.map((item) => item.path),
    contentPaths: contentItems.map((item) => item.path),
  }
})
