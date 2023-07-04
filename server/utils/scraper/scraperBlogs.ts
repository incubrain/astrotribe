export interface Blog {
  name: string
  url: string
  selectorBase: string
  selectorPagination: string
  selectorConfig: {
    title: string
    author: string
    published: string
    category: string
    content: string
    image: string
  }
}

const scraperBlogs: Blog[] = [
  {
    name: 'jwst-nasa-blog',
    url: 'https://blogs.nasa.gov/webb/',
    selectorBase: 'article',
    selectorPagination: '.nav-links .next',
    selectorConfig: {
      title: '.entry-title a',
      author: '.entry-footer .author a',
      published: '.entry-footer .posted-on a',
      category: '.entry-footer .cat-links a',
      content: '.entry-content',
      image: '.entry-content figure'
    }
  }
  // Add more blogs as needed
]

export default scraperBlogs
