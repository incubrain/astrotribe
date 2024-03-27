export default defineEventHandler(async (event) => {
  return await scrapeData({
    config: {
      scraperCategory: 'research',
      singleWebsite: 'arxiv',
      tableName: 'papers',
      conflictRow: 'url'
    },
    event
  })
})
