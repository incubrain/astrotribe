export default defineTask({
  meta: {
    name: 'scrape:news',
    description: 'Scrape news from various sources'
  },
  run({ payload }) {
    $fetch('/api/admin/scrape-news')
    return payload
  }
})
