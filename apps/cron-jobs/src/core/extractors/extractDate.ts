import * as cheerio from 'cheerio';
import * as chrono from 'chrono-node';

export function extractPublishedDate(html: string): Date | null {
  const $ = cheerio.load(html);

  // 1. Check metadata
  const metaDate = checkMetadata($);
  if (metaDate) return metaDate;

  // 2. Check specific HTML elements
  const elementDate = checkElements($);
  if (elementDate) return elementDate;

  // 3. Parse content for date patterns
  const contentDate = parseContent($);
  if (contentDate) return contentDate;

  // 4. Use NLP as a last resort
  return useNLP($);
}

function checkMetadata($: cheerio.CheerioAPI): Date | null {
  const metaTags = [
    'article:published_time',
    'datePublished',
    'date',
    'publishdate',
    'pubdate',
    'og:published_time',
    'publication-date',
    'release_date',
  ];

  for (const tag of metaTags) {
    const metaElement = $(`meta[property="${tag}"], meta[name="${tag}"]`);
    if (metaElement.length) {
      const dateString = metaElement.attr('content');
      if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) return date;
      }
    }
  }

  return null;
}

function checkElements($: cheerio.CheerioAPI): Date | null {
  const dateElements = $(
    'time, [itemprop="datePublished"], .entry-meta-date, .published, .post-date, .entry-date, .date'
  );

  for (let i = 0; i < dateElements.length; i++) {
    const element = dateElements.eq(i);
    let dateString = element.attr('datetime') || element.text();
    if (dateString) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) return date;
    }
  }

  return null;
}

function parseContent($: cheerio.CheerioAPI): Date | null {
  const bodyText = $('body').text();
  const dateRegex = /\d{1,4}[-./]\d{1,2}[-./]\d{2,4}/g;
  const matches = bodyText.match(dateRegex);

  if (matches) {
    for (const match of matches) {
      const date = new Date(match);
      if (!isNaN(date.getTime())) return date;
    }
  }

  return null;
}

function useNLP($: cheerio.CheerioAPI): Date | null {
  const bodyText = $('body').text();
  const now = new Date();
  const results = chrono.parse(bodyText, now, { forwardDate: false });

  if (results.length > 0) {
    const start = results.find((result) => {
      const startDate = result.start.get('year');
      if (startDate) {
        return startDate <= now.getFullYear();
      }
      return false;
    });
    return start?.date() || now;
  }

  return null;
}
