export default defineTask({
  meta: {
    name: 'scrape:papers',
    description: 'Scrape research papers from Arxiv'
  },
  run({ payload }) {
    $fetch('/api/admin/scrape-papers')
    return payload
  }
})
