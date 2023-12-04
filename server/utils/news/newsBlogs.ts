// Defines the structure for configuring how to select various elements of a blog post.
export interface SelectorConfig {
  title: string,
  author: string
  created_at: string
  body: string
  featured_image: string
  ignore?: string[]
  videos?: string
}

// Represents the structure and configuration for a specific blog.
export interface Blog {
  id: number
  name: string
  url: string
  selectorBase: string
  selectorPagination: string
  scraper: any
  selectorConfig: SelectorConfig
}

// Array containing configurations for different blogs to be scraped.
const newsBlogs: Blog[] = [
  {
    // Configuration for the first blog.
    id: 1,
    name: 'jwst-nasa-blog', // Name of the blog.
    url: 'https://blogs.nasa.gov/webb/', // URL of the blog.
    selectorBase: 'article', // Base selector for scraping.
    selectorPagination: '.nav-links .next', // Selector for the next page link.
    scraper: newsScraperNasa, // Function used to scrape this specific blog.
    selectorConfig: {
      // Specific element selectors for this blog.
      title: '.entry-title a',
      author: '.entry-footer .author a',
      created_at: '.entry-footer .posted-on time',
      body: '.entry-content',
      featured_image: 'figure'
    }
  },
  {
    // Configuration for the second blog.
    id: 2,
    name: 'space.com',
    url: 'https://www.space.com/news/archive',
    selectorBase: 'article',
    selectorPagination: '.nav-links .next',
    scraper: newsScraperSpaceCom,
    selectorConfig: {
      title: 'header > h1',
      author: 'a.author-byline__link',
      created_at: 'time.relative-date',
      body: '.content-wrapper > #article-body',
      featured_image: 'figure',
      ignore: [
        // List of selectors to ignore during scraping.
        '.jwplayer__wrapper',
        '.ad-unit',
        '.fancy-box',
        '.jwplayer__widthsetter',
        'newsletter-inbodyContent-slice'
      ]
    }
  }
  // Additional blog configurations can be added as needed.
]

export default newsBlogs
