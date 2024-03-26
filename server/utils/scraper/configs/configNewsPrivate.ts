import type { ScraperT } from '@/types/scraper'

export const configNewsPrivate: ScraperT[] = [
  {
    id: 1,
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
  }
]
