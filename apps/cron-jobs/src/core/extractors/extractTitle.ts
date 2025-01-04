import * as cheerio from 'cheerio';

interface TitleExtractor {
  name: string;
  extract: ($: cheerio.CheerioAPI) => string | null;
}

const extractors: TitleExtractor[] = [
  {
    name: 'Open Graph',
    extract: ($) => $('meta[property="og:title"]').attr('content') || null,
  },
  {
    name: 'Twitter Card',
    extract: ($) => $('meta[name="twitter:title"]').attr('content') || null,
  },
  {
    name: 'Meta Title',
    extract: ($) => $('meta[name="title"]').attr('content') || null,
  },
  {
    name: 'H1',
    extract: ($) => $('h1').first().text().trim() || null,
  },
  {
    name: 'Title Tag',
    extract: ($) => $('title').text().trim() || null,
  },
  {
    name: 'Schema.org JSON-LD',
    extract: ($) => {
      const jsonLd = $('script[type="application/ld+json"]');
      if (jsonLd.length) {
        try {
          const data = JSON.parse(jsonLd.first().text());
          if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') {
            return data.headline || null;
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e);
        }
      }
      return null;
    },
  },
  {
    name: 'Article Title Class',
    extract: ($) =>
      $('.article-title, .post-title, .entry-title').first().text().trim() ||
      null,
  },
];

export function extractTitle(html: string): string | null {
  const $ = cheerio.load(html);
  for (const extractor of extractors) {
    const title = extractor.extract($);
    if (title) {
      return title;
    }
  }

  console.log('Could not extract title');
  return null;
}
