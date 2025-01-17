import * as cheerio from 'cheerio'
import natural from 'natural'

function parseKeywords(keywords: string | string[] | null): string[] {
  if (!keywords) return []

  if (typeof keywords === 'string') {
    try {
      const parsed = JSON.parse(keywords)
      if (Array.isArray(parsed)) {
        return parsed.map((k) => k.toString())
      } else if (typeof parsed === 'object') {
        return Object.values(parsed).map((k: any) => k.toString())
      }
    } catch (e) {
      return keywords.split(',').map((k) => k.trim())
    }
  }

  if (Array.isArray(keywords)) {
    return keywords.map((k) => k.toString())
  }

  return []
}

interface KeywordExtractor {
  name: string
  extract: ($: cheerio.CheerioAPI, fullText: string) => string[] | null
}

const extractors: KeywordExtractor[] = [
  {
    name: 'Meta Keywords',
    extract: ($) => {
      const metaKeywords = $('meta[name="keywords"]').attr('content')
      return metaKeywords ? parseKeywords(metaKeywords) : null
    },
  },
  {
    name: 'Schema.org JSON-LD',
    extract: ($) => {
      const jsonLd = $('script[type="application/ld+json"]')
      if (jsonLd.length) {
        try {
          const data = JSON.parse(jsonLd.first().text())
          if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') {
            return parseKeywords(data.keywords)
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e)
        }
      }
      return null
    },
  },
  {
    name: 'Article Tags',
    extract: ($) => {
      const tags = $('.tags a, .keywords a, .topics a')
      return tags.length > 0 ? tags.map((_: any, el) => $(el).text().trim()).get() : null
    },
  },
  {
    name: 'TF-IDF Analysis',
    extract: (_, fullText) => {
      const tfidf = new natural.TfIdf()
      tfidf.addDocument(fullText)

      const stopwords = new Set(natural.stopwords)
      const tokenizer = new natural.WordTokenizer()
      const tokens = tokenizer.tokenize(fullText) || []

      const wordScores = tokens
        .filter((token) => token.length > 2 && !stopwords.has(token.toLowerCase()))
        .map((token) => ({
          word: token,
          score: tfidf.tfidf(token, 0),
        }))

      wordScores.sort((a, b) => b.score - a.score)
      return wordScores.slice(0, 10).map((item) => item.word)
    },
  },
]

function filterKeywords(keywords: string[]): string[] {
  const currentYear = new Date().getFullYear()
  const exceptions = new Set([
    'related',
    'articles',
    'inc',
    // Add more specific words to ignore here
  ])

  return keywords.filter((keyword) => {
    const lowercaseKeyword = keyword.toLowerCase()

    // Check if it's not in the exceptions list
    if (exceptions.has(lowercaseKeyword)) return false

    // Check if it's not a year between 1900 and current year
    const year = parseInt(keyword, 10)
    if (!isNaN(year) && year >= 1900 && year <= currentYear) return false

    return true
  })
}

export function extractKeywords(html: string): { values: string[] } {
  const $ = cheerio.load(html)
  const fullText = $('body').text()

  let keywords: string[] = []

  for (const extractor of extractors) {
    const extractedKeywords = extractor.extract($, fullText)
    if (extractedKeywords && extractedKeywords.length > 0) {
      console.log(`Keywords extracted using ${extractor.name} method`)
      keywords = keywords.concat(extractedKeywords)
      if (keywords.length >= 10) break // Stop if we have enough keywords
    }
  }

  keywords = filterKeywords(keywords)

  // Remove duplicates and limit to top 10
  keywords = Array.from(new Set(keywords)).slice(0, 10)

  if (keywords.length > 0) {
    console.log(`Extracted keywords: ${keywords.join(', ')}`)
  } else {
    console.log('No keywords found')
  }

  return { values: keywords }
}
