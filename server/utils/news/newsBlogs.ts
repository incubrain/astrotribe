// Defines the structure for configuring how to select various elements of a blog post.
export interface SelectorConfig {
  title: string
  author: string
  published_at: string
  body: string
  featured_image: string
  ignore?: string[]
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

// consider:
// 1
// https://www.stsci.edu/jwst/news-events/news
// https://webbtelescope.org/news/news-releases
// https://www.stsci.edu/news/newsletters
// https://hubblesite.org/news/news-releases
// https://www.nasa.gov/news/all-news/ // latest news from nasa
// https://www.jpl.nasa.gov/news

// https://earthobservatory.nasa.gov/blogs/ // multiple blogs

// https://nightsky.jpl.nasa.gov/news-archive.cfm

// Array containing configurations for different blogs to be scraped.
const newsBlogs: Blog[] = [
  {
    // Nasa Config
    id: 1,
    name: 'jwst-nasa-blog', // Name of the blog.
    url: [
      'https://blogs.nasa.gov/webb/',
      'https://blogs.nasa.gov/spacestation/',
      'https://blogs.nasa.gov/commercialcrew/',
      'https://blogs.nasa.gov/artemis/',
      'https://blogs.nasa.gov/clps/',
      'https://blogs.nasa.gov/earthexpeditions/',
      'https://blogs.nasa.gov/nelson/',
      'https://blogs.nasa.gov/ixpe/',
      'https://blogs.nasa.gov/interns/',
      'https://blogs.nasa.gov/stationreport/', // maybe not?
      'https://blogs.nasa.gov/kennedy/',
      'https://blogs.nasa.gov/northropgrumman/',
      'https://blogs.nasa.gov/osiris-rex/',
      'https://blogs.nasa.gov/parkersolarprobe/',
      'https://blogs.nasa.gov/sofia/',
      'https://blogs.nasa.gov/spacex/',
      'https://blogs.nasa.gov/Watch_the_Skies/',
      'https://blogs.nasa.gov/sunspot/',
      'https://blogs.nasa.gov/odeo/',
      ''
    ],
    selectorBase: 'article', // Base selector for scraping.
    selectorPagination: '.nav-links .next', // Selector for the next page link.
    scraper: newsScraperNasa, // Function used to scrape this specific blog.
    selectorConfig: {
      // Specific element selectors for this blog.
      title: '.entry-title a',
      author: '.entry-footer .author a',
      published_at: '.entry-footer .posted-on time',
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
      published_at: 'time.relative-date',
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
