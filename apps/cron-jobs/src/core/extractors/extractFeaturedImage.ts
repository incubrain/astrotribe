import * as cheerio from 'cheerio';

interface ImageExtractor {
  name: string;
  extract: ($: cheerio.CheerioAPI, url: string) => string | null;
}

const extractors: ImageExtractor[] = [
  {
    name: 'Open Graph Image',
    extract: ($) => {
      return $('meta[property="og:image"]').attr('content') || null;
    },
  },
  {
    name: 'Twitter Image',
    extract: ($) => {
      return $('meta[name="twitter:image"]').attr('content') || null;
    },
  },
  {
    name: 'Schema.org JSON-LD',
    extract: ($) => {
      const jsonLd = $('script[type="application/ld+json"]').first().html();
      if (jsonLd) {
        try {
          const data = JSON.parse(jsonLd);
          if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') {
            return data.image || null;
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e);
        }
      }
      return null;
    },
  },
  {
    name: 'Article Image',
    extract: ($) => {
      return (
        $('article img, .post-content img, .entry-content img')
          .first()
          .attr('src') || null
      );
    },
  },
  {
    name: 'First Image',
    extract: ($) => {
      return $('img').first().attr('src') || null;
    },
  },
  {
    name: 'Background Image',
    extract: ($) => {
      let backgroundImage = null;
      $('*').each((_, element) => {
        const style = $(element).attr('style');
        if (style && style.includes('background-image')) {
          const match = style.match(/url\(['"]?(.*?)['"]?\)/);
          if (match && match[1]) {
            backgroundImage = match[1];
            return false; // Break the loop
          }
        }
      });
      return backgroundImage;
    },
  },
];

export function extractFeaturedImage(
  cleanHTML: string,
  url: string
): string | null {
  const $ = cheerio.load(cleanHTML);

  for (const extractor of extractors) {
    const imageUrl = extractor.extract($, url);
    if (imageUrl) {
      console.log(`Featured image extracted using ${extractor.name} method`);
      return resolveRelativeUrl(imageUrl, url);
    }
  }

  console.log('Could not extract featured image');
  return null;
}

function resolveRelativeUrl(imageUrl: string, baseUrl: string): string {
  try {
    return new URL(imageUrl, baseUrl).href;
  } catch (e) {
    console.error('Error resolving relative URL:', e);
    return imageUrl;
  }
}
