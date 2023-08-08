export interface SelectorConfig {
  title: string
  author: string
  published: string
  body: string
  images: string
  ignore?: string[]
  videos?: string
}

export interface Blog {
  id: number
  name: string
  url: string
  selectorBase: string
  selectorPagination: string
  scraper: any
  selectorConfig: SelectorConfig
}

const newsBlogs: Blog[] = [
  {
    id: 1,
    name: 'jwst-nasa-blog',
    url: 'https://blogs.nasa.gov/webb/',
    selectorBase: 'article',
    selectorPagination: '.nav-links .next',
    scraper: newsScraperNasa,
    selectorConfig: {
      title: '.entry-title a',
      author: '.entry-footer .author a',
      published: '.entry-footer .posted-on time',
      body: '.entry-content',
      images: '.entry-content figure'
    }
  },
  {
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
        '.jwplayer__wrapper',
        '.ad-unit',
        '.fancy-box',
        '.jwplayer__widthsetter',
        'newsletter-inbodyContent-slice'
      ] // remove from the selectors queried
    }
  }
  // Add more blogs as needed
]

export default newsBlogs
