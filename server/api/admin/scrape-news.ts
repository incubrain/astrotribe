export default defineEventHandler(async (event) => {
  return await scrapeData({
    config: {
      scraperCategory: 'news-government',
      tableName: 'news',
      conflictRow: 'url'
    },
    event
  })
})