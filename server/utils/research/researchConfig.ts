import type { ScraperT } from '@/types/scraper'

export const researchConfig: ScraperT[] = [
  {
    id: 1,
    name: 'arxiv',
    urls: [
      'https://arxiv.org/list/astro-ph.GA/current',
      'https://arxiv.org/list/astro-ph.CO/current',
      'https://arxiv.org/list/astro-ph.EP/current',
      'https://arxiv.org/list/astro-ph.HE/current',
      'https://arxiv.org/list/astro-ph.IM/current',
      'https://arxiv.org/list/astro-ph.SR/current'
    ],
    baseUrl: 'https://arxiv.org',
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
  }
]

// We can summarise research papers for our academic users

// https://www.mdpi.com/search?q=&journal=astronomy&sort=pubdate&page_count=50 // ok
// https://astro.theoj.org/articles // ok

// https://arxiv.org/list/physics.space-ph/recent

// download PDFs
// https://www.researchgate.net/topic/Astrophysics/publications
// https://www.researchgate.net/topic/Astronomy/publications
