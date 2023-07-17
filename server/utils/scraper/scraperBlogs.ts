import scraperNasa from './scraperNasa'

export interface Blog {
  name: string
  url: string
  selectorBase: string
  selectorPagination: string
  scraper: any
  selectorConfig: {
    title: string
    author: string
    published: string
    category: string
    tags: string
    body: string
    images: string
    videos?: string
  }
}

const scraperBlogs: Blog[] = [
  {
    name: 'jwst-nasa-blog',
    url: 'https://blogs.nasa.gov/webb/',
    selectorBase: 'article',
    selectorPagination: '.nav-links .next',
    scraper: scraperNasa,
    selectorConfig: {
      title: '.entry-title a',
      author: '.entry-footer .author a',
      published: '.entry-footer .posted-on time',
      category: '.entry-footer .cat-links a',
      tags: '.entry-footer .tags a',
      body: '.entry-content',
      images: '.entry-content figure'
    }
  }
  // Add more blogs as needed
]

export default scraperBlogs
