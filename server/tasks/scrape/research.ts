export default defineTask({
  meta: {
    name: 'scrape:research',
    description: 'Scrape research papers from Arxiv'
  },
  run({ payload }) {
    $fetch('/api/admin/scrape-research')
    return payload
  }
})
