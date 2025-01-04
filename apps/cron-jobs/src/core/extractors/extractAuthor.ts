import * as cheerio from 'cheerio'

interface AuthorExtractor {
  name: string
  extract: ($: cheerio.CheerioAPI) => string | null
}

const extractors: AuthorExtractor[] = [
  {
    name: 'Schema.org JSON-LD',
    extract: ($) => {
      const jsonLd = $('script[type="application/ld+json"]').first().html()
      if (jsonLd) {
        try {
          const data = JSON.parse(jsonLd)
          if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') {
            if (typeof data.author === 'string') {
              return data.author
            } else if (typeof data.author === 'object' && data.author.name) {
              return data.author.name
            }
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e)
        }
      }
      return null
    },
  },
  {
    name: 'Meta Author',
    extract: ($) => {
      return $('meta[name="author"]').attr('content') || null
    },
  },
  {
    name: 'Open Graph',
    extract: ($) => {
      return (
        $('meta[property="og:author"], meta[property="article:author"]').attr('content') || null
      )
    },
  },
  {
    name: 'Twitter Creator',
    extract: ($) => {
      return $('meta[name="twitter:creator"]').attr('content') || null
    },
  },
  {
    name: 'RelAuthor Link',
    extract: ($) => {
      return $('link[rel="author"]').attr('href') || null
    },
  },
  {
    name: 'Common Author Classes',
    extract: ($) => {
      return $('.author, .byline, .entry-author, .post-author').first().text().trim() || null
    },
  },
  {
    name: 'Author Element',
    extract: ($) => {
      return $('[itemprop="author"]').first().text().trim() || null
    },
  },
  {
    name: 'Regex Pattern',
    extract: ($) => {
      const bodyText = $('body').text()
      const authorPatterns = [
        /By\s+([\w\s]+)/i,
        /Author[:\s]+([\w\s]+)/i,
        /Written by\s+([\w\s]+)/i,
      ]
      for (const pattern of authorPatterns) {
        const match = bodyText.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
      return null
    },
  },
]

export function extractAuthor(cleanHTML: string): string | null {
  const $ = cheerio.load(cleanHTML)
  for (const extractor of extractors) {
    const author = extractor.extract($)

    if (author) {
      console.log(`${extractor.name} extractor found author: "${author}"`)
      return author
    } else {
      console.log(`${extractor.name} extractor did not find an author.`)
    }
  }

  return null
}
