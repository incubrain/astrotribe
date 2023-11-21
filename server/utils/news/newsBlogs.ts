// Defines the structure for configuring how to select various elements of a blog post.
export interface SelectorConfig {
  title: string // CSS selector to find the post title.
  author: string // CSS selector to find the author's name.
  published: string // CSS selector to find the published date.
  body: string // CSS selector to find the main content/body of the post.
  images: string // CSS selector to find images in the post.
  ignore?: string[] // Optional array of selectors to ignore/remove from the scraped content.
  videos?: string // Optional CSS selector to find videos in the post.
}

// Represents the structure and configuration for a specific blog.
export interface Blog {
  id: number // Unique identifier for the blog.
  name: string // Human-readable name of the blog.
  url: string // URL of the blog.
  selectorBase: string // Base CSS selector used for scraping.
  selectorPagination: string // CSS selector to identify pagination links.
  scraper: any // Function used for scraping the blog.
  selectorConfig: SelectorConfig // Specific selectors to use for scraping elements of the blog.
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
      published: '.entry-footer .posted-on time',
      body: '.entry-content',
      images: '.entry-content figure'
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
      title: 'header h1',
      author: '.author a',
      published: '.relative-date',
      body: '.content-wrapper',
      images: 'figure',
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
