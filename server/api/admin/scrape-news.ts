export default defineEventHandler(async (event) => {
  return await scrapeData({
    config: {
      scraperCategory: 'news-government',
      singleWebsite: 'nasa',
      tableName: 'news',
      conflictRow: 'url'
    },
    event
  })
})
