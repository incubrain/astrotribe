import type { ScraperT } from '@/types/scraper'

export const configResearch: ScraperT[] = [
  {
    id: 1,
    name: 'arxiv',
    urls: [
      'https://arxiv.org/list/astro-ph.GA/new',
      'https://arxiv.org/list/astro-ph.CO/new',
      'https://arxiv.org/list/astro-ph.EP/new',
      'https://arxiv.org/list/astro-ph.HE/new',
      'https://arxiv.org/list/astro-ph.IM/new',
      'https://arxiv.org/list/astro-ph.SR/new'
    ],
    baseUrl: 'https://arxiv.org',
    selectorPagination: '.next .page-numbers', // Selector for the next page link.
    selectorBaseLink: '#dlpage > dl > dt > span',
    selectorConfigLink: {
      url: {
        selector: 'a[title="Abstract"]',
        extract: 'attribute',
        attributeName: 'href'
      }
    },
    selectorBasePage: 'body',
    selectorConfigPage: {
      title: {
        selector: '.ltx_title.ltx_title_document',
        extract: 'text'
      },
      author: {
        selector: '.ltx_personname',
        extract: 'text'
      },
      description: {
        selector: '.ltx_abstract',
        extract: 'text'
      },
      published_at: {
        selector: '#watermark-tr',
        extract: 'text'
      }
    },
    selectorIgnore: ['button.sr-only', 'math.ltx_Math']
  }
]

// We can summarise research papers for our academic users

// https://www.mdpi.com/search?q=&journal=astronomy&sort=pubdate&page_count=50 // ok
// https://astro.theoj.org/articles // ok

// https://arxiv.org/list/physics.space-ph/recent

// download PDFs
// https://www.researchgate.net/topic/Astrophysics/publications
// https://www.researchgate.net/topic/Astronomy/publications
