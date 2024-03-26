import type { ScraperT } from '@/types/scraper'

// Creative Content
// https://www.universetoday.com/ // free to use, images might require additional permissions
// http://www.collectspace.com//
// https://www.space.com/

// consider:

// https://earthobservatory.nasa.gov/blogs/ // multiple blogs
// https://nightsky.jpl.nasa.gov/news-archive.cfm

// spacex
// https://spaceflightnow.com/?s=spacex

// ula
// https://blog.ulalaunch.com/blog/page/1

// ASI Italian Space Agency
// https://www.asi.it/en/news/

// UK space agency
// https://space.blog.gov.uk/

export const configNewsGovernment: ScraperT[] = [
  // {
  //   // Nasa Blogs
  //   id: 1,
  //   name: 'nasa-blogs',
  //   urls: [
  //     'https://blogs.nasa.gov/webb/',
  //     'https://blogs.nasa.gov/spacestation/',
  //     'https://blogs.nasa.gov/commercialcrew/',
  //     'https://blogs.nasa.gov/artemis/',
  //     'https://blogs.nasa.gov/clps/',
  //     'https://blogs.nasa.gov/earthexpeditions/',
  //     'https://blogs.nasa.gov/nelson/',
  //     'https://blogs.nasa.gov/ixpe/',
  //     'https://blogs.nasa.gov/interns/',
  //     'https://blogs.nasa.gov/stationreport/', // maybe not?
  //     'https://blogs.nasa.gov/kennedy/',
  //     'https://blogs.nasa.gov/northropgrumman/',
  //     'https://blogs.nasa.gov/osiris-rex/',
  //     'https://blogs.nasa.gov/parkersolarprobe/',
  //     'https://blogs.nasa.gov/sofia/',
  //     'https://blogs.nasa.gov/spacex/',
  //     'https://blogs.nasa.gov/Watch_the_Skies/',
  //     'https://blogs.nasa.gov/sunspot/',
  //     'https://blogs.nasa.gov/odeo/'
  //   ],
  //   selectorBaseCard: 'article',
  //   selectorPagination: '.nav-links .next', // Selector for the next page link.
  //   scraper: scraperGenericNasaBlogs, // Function used to scrape this specific blog.
  //   selectorConfigLink: {
  //     // Specific element selectors for this blog.
  //     title: '.entry-title a',
  //     author: '.entry-footer .author a',
  //     published_at: '.entry-footer .posted-on time',
  //     body: '.entry-content',
  //     featured_image: 'figure'
  //   }
  // },
  {
    id: 2,
    name: 'nasa',
    urls: ['https://www.nasa.gov/news/all-news/'],
    baseUrl: 'https://www.nasa.gov',
    selectorBaseCard: '.hds-content-item',
    selectorPagination: '.next .page-numbers', // Selector for the next page link.
    selectorConfigLink: {
      title: {
        selector: '.hds-content-item-heading',
        extract: 'text'
      },
      url: {
        selector: '.hds-content-item-heading',
        extract: 'attribute',
        attributeName: 'href'
      },
      description: {
        selector: 'p',
        extract: 'text'
      },
      featured_image: {
        selector: 'figure img',
        extract: 'attribute',
        attributeName: 'src'
      }
    },
    selectorBasePage: 'article',
    selectorConfigPage: {
      body: {
        selector: '.usa-article-content',
        extract: 'text'
      },
      published_at: {
        selector:
          '.article-meta-item.grid-row.flex-align-center.border-bottom.padding-y-2 > .heading-12.text-uppercase',
        extract: 'text'
      },
      author: {
        selector: '.grid-col > .hds-meta-heading .heading-14',
        extract: 'text'
      }
    }
  },
  {
    id: 3,
    name: 'isro',
    urls: ['https://www.isro.gov.in/Archives.html'],
    baseUrl: 'https://www.isro.gov.in/',
    selectorPagination: '.next .page-numbers', // Selector for the next page link.
    selectorBaseCard: 'tbody tr',
    selectorConfigLink: {
      title: {
        selector: '.link',
        extract: 'text'
      },
      url: {
        selector: '.link a',
        extract: 'attribute',
        attributeName: 'href'
      },
      published_at: {
        selector: '.date',
        extract: 'text'
      }
    },
    selectorBasePage: '.card-body',
    selectorConfigPage: {
      body: {
        selector: 'self',
        extract: 'text'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      }
    }
  },
  {
    id: 4,
    name: 'esa',
    urls: [
      'https://www.esa.int/Space_Safety/(archive)/0',
      'https://www.esa.int/Science_Exploration/(archive)/0',
      'https://www.esa.int/Applications/(archive)/0',
      'https://www.esa.int/Enabling_Support/(archive)/0'
    ],
    baseUrl: 'https://www.esa.int',
    selectorBaseCard: '.grid-item.story',
    selectorPagination: '.paging', // title="Next page" // Selector for the next page link.
    selectorConfigLink: {
      title: {
        selector: 'header > h3',
        extract: 'text'
      },
      url: {
        selector: 'a',
        extract: 'attribute',
        attributeName: 'href'
      },
      featured_image: {
        selector: 'figure > img',
        extract: 'attribute',
        attributeName: 'src'
      },
      published_at: {
        selector: 'header > .meta > span',
        extract: 'text'
      }
    },
    selectorBasePage: 'article',
    selectorConfigPage: {
      body: {
        selector: 'self',
        extract: 'text'
      }
    }
  },
  {
    id: 5,
    name: 'csa',
    urls: ['https://www.asc-csa.gc.ca/eng/news/articles/'],
    baseUrl: 'https://www.asc-csa.gc.ca',
    selectorBaseCard: 'article',
    selectorPagination: 'ul .pagination', // rel="next" // Selector for the next page link.
    selectorConfigLink: {
      title: {
        selector: 'figcaption h3',
        extract: 'text'
      },
      url: {
        selector: 'a',
        extract: 'attribute',
        attributeName: 'href'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      },
      published_at: {
        selector: 'time',
        extract: 'attribute',
        attributeName: 'datetime'
      }
    },
    selectorBasePage: 'main',
    selectorConfigPage: {
      body: {
        selector: 'self',
        extract: 'text'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      }
    }
  },
  {
    id: 6,
    name: 'cnsa',
    urls: ['https://www.cnsa.gov.cn/english/n6465652/n6465653/index.html'],
    baseUrl: 'https://www.cnsa.gov.cn/english/',
    selectorBaseCard: 'span > table > tbody > tr > td > a',
    selectorPagination: 'font', // innerText="Next page"
    selectorConfigLink: {
      title: {
        selector: 'self',
        extract: 'text'
      },
      url: {
        selector: 'self',
        extract: 'attribute',
        attributeName: 'href'
      }
    },
    selectorBasePage: 'body',
    selectorConfigPage: {
      body: {
        selector: 'table.black14_30',
        extract: 'text'
      },
      published_at: {
        selector: 'tr > td.brown',
        extract: 'text'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      }
    }
  },
  {
    id: 7,
    name: 'jaxa',
    urls: ['https://global.jaxa.jp/press/2024/'],
    baseUrl: 'https://global.jaxa.jp',
    selectorBaseCard: '.press_release ul li',
    selectorPagination: '.elem_years_selector_pad', // li a goto page
    selectorConfigLink: {
      title: {
        selector: 'dd > a',
        extract: 'text'
      },
      url: {
        selector: 'dd > a',
        extract: 'attribute',
        attributeName: 'href'
      },
      published_at: {
        selector: 'li > dl > dt',
        extract: 'text'
      }
    },
    selectorBasePage: '.area_content_main_pad',
    selectorConfigPage: {
      body: {
        selector: 'self',
        extract: 'text'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      }
    }
  },
  {
    id: 8,
    name: 'roscosmos',
    urls: ['https://tass.com/space-programs'],
    baseUrl: 'https://tass.com',
    selectorBaseCard: '.theme-item',
    selectorPagination: '.elem_years_selector_pad', // li a goto page
    selectorConfigLink: {
      title: {
        selector: '.theme-item__title',
        extract: 'text'
      },
      url: {
        selector: 'self',
        extract: 'attribute',
        attributeName: 'href'
      }
    },
    selectorBasePage: '#news',
    selectorConfigPage: {
      body: {
        selector: '.text-content',
        extract: 'text'
      },
      description: {
        selector: '.news-header__lead',
        extract: 'text'
      },
      published_at: {
        selector: 'span > dateformat',
        extract: 'attribute',
        attributeName: 'time'
      },
      featured_image: {
        selector: 'img',
        extract: 'attribute',
        attributeName: 'src'
      }
    }
  }
  // {
  //   // Configuration for the second blog.
  //   id: 3,
  //   name: 'space.com',
  //   urls: ['https://www.space.com/news/archive'],
  //   selectorBaseCard: 'article',
  //   selectorPagination: '.nav-links .next',
  //   selectorConfigLink: {
  //     title: 'header > h1',
  //     author: 'a.author-byline__link',
  //     published_at: 'time.relative-date',
  //     body: '.content-wrapper > #article-body',
  //     featured_image: 'figure',
  //     ignore: [
  //       // List of selectors to ignore during scraping.
  //       '.jwplayer__wrapper',
  //       '.ad-unit',
  //       '.fancy-box',
  //       '.jwplayer__widthsetter',
  //       'newsletter-inbodyContent-slice'
  //     ]
  //   }
  // }
  // Additional blog configurations can be added as needed.
]
