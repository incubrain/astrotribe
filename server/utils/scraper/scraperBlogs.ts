interface Blog {
  name: string
  url: string
  selectorConfig: {
    title: string
    author: string
    published: string
    category: string
    content: string
    featured_image: string
  }
}

const scraperBlogs: Blog[] = [
  {
    name: 'jwst-nasa-blog',
    url: 'https://blogs.nasa.gov/webb/',
    selectorConfig: {
      title: '.entry-title a',
      author: '.entry-footer .author a',
      published: '.entry-footer .posted-on a',
      category: '.entry-footer .cat-links a',
      content: '.entry-content',
      featured_image: '.entry-content img'
    }
  }
  // Add more blogs as needed
]

export default scraperBlogs
