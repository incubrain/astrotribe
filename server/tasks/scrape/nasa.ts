export default defineTask({
  meta: {
    name: 'scrape:nasa',
    description: 'Returns the provided nasa'
  },
  run({ payload, context }) {
    console.log('Running scrape task...')
    const posts = newsScraper()
    console.log('scrape:nasa posts', posts)
    return payload
  }
})
