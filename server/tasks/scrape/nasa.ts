export default defineTask({
  meta: {
    name: 'scrape:nasa',
    description: 'Returns the provided nasa'
  },
  run({ payload, name }) {
    $fetch('/api/admin/store-news')
    return payload
  }
})
