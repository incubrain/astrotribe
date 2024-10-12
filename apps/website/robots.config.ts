export default [
  { UserAgent: '*' },
  { Allow: '/' },
  { BlankLine: true },
  { Comment: 'Allow crawling of all pages' },
  { Sitemap: (req) => `https://${req.headers.host}/sitemap.xml` },
]
