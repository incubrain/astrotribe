export default defineEventHandler(async (event) => {
  return await scrapeData({
    config: {
      scraperCategory: 'research',
      singleWebsite: 'arxiv',
      tableName: 'research',
      conflictRow: 'url'
    },
    event
  })
})
