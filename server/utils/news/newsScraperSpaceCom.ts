import { Page } from 'puppeteer'
import { Blog, SelectorConfig } from './newsBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.

const newsScraperSpaceCom = async (
  page: Page,
  blog: Blog,
  isDevelopment: true,
  numArticlesPerMonth: number | null = 1
) => {
  const scrapedData: any[] = []
  console.log('newsScraperSpaceCom:', page)

  // Get the list of months from the sidebar
  const months = await page.$$eval('#sidebar ul > li > ul > li > a', (months) =>
    months.map((month) => (month as HTMLAnchorElement).href)
  )
  const monthsToIterate = isDevelopment ? [months[0]] : months

  console.log('newsScraperSpaceCom:', months)

  // Iterate through the months
  for (const month of monthsToIterate) {
    await page.goto(month)
    console.log('newsScraperSpaceCom:', month)

    // Get the list of articles for the current month
    const articles = await page.$$('.archive-list ul > ul > li.day-article > a')
    // Limit the number of articles to iterate through based on the numArticlesPerMonth parameter
    const articlesToIterate =
      numArticlesPerMonth === null ? articles : articles.slice(0, numArticlesPerMonth)
    console.log('newsScraperSpaceCom:', articles)

    // Iterate through the articles
    for (const articleLink of articlesToIterate) {
      await articleLink.click() // Click on the article link
      // Scrape the current article
      const articleData = await page.$eval(
        blog.selectorBase,
        (article: Element, selectorConfig: SelectorConfig) => {
          const data: { [key: string]: any } = {}

          for (const key in selectorConfig) {
            const selectorValue = selectorConfig[key as keyof SelectorConfig]
            if (selectorValue === undefined) continue
            const selectors = Array.isArray(selectorValue) ? selectorValue.join(',') : selectorValue
            const elements = article.querySelectorAll(selectors)
            if (!elements.length) {
              data[key] = null
              continue
            }

            switch (key) {
              case 'images':
                data[key] = Array.from(elements).map((element) => {
                  const img = element.querySelector('img')
                  const figcaption = element.querySelector('figcaption')
                  if (figcaption) {
                    const aTags = figcaption.querySelectorAll('a')
                    aTags.forEach((a) => {
                      a.parentNode?.removeChild(a)
                    })
                  }
                  const caption =
                    figcaption?.querySelector('.caption-text').textContent.trim() || undefined
                  const credit =
                    figcaption?.querySelector('.credit').textContent?.trim() || 'Space.com'
                  return {
                    src: img?.getAttribute('src'),
                    alt: img?.getAttribute('alt'),
                    caption,
                    credit
                  }
                })
                break
              case 'author':
                data[key] = {
                  name: elements[0].textContent?.trim(),
                  link: elements[0].getAttribute('href'),
                  image: null
                }
                break
              case 'published':
                data[key] = elements[0].getAttribute('datetime')
                break
              case 'body':
              case 'title':
                data[key] = elements[0].textContent?.replace(/\n/g, ' ').trim()
                data.srcArticle = elements[0].getAttribute('src')
                break
              default:
                break
            }
          }
          console.log('dataSraped:', data)
          return data
        },
        blog.selectorConfig
      )

      scrapedData.push(articleData)

      await page.goBack() // Go back to the month's article list
    }
  }

  return scrapedData
}

export default newsScraperSpaceCom
