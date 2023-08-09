import { Page } from 'puppeteer'
import { Blog, SelectorConfig } from './newsBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.

const newsScraperNasa = async (page: Page, blog: Blog) => {
  return await page.$$eval(
    blog.selectorBase,
    (articles: Element[], selectorConfig: SelectorConfig) => {
      return articles.map((article: Element) => {
        const data: { [key: string]: any } = {}

        for (const key in selectorConfig) {
          const elements = article.querySelectorAll(key as keyof SelectorConfig)

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
                  figcaption?.textContent
                    ?.split(/(Image credit:|Credit:|Credits:|Image Credit:)/)[0]
                    .trim() || null
                const credit =
                  figcaption?.textContent
                    ?.split(/(Image credit:|Credit:|Credits:|Image Credit:)/)[2]
                    ?.trim() || 'NASA'
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
              data[key] = {
                name: elements[0].textContent?.trim(),
                link: elements[0].getAttribute('href')
              }
          }
        }
        return data
      })
    },
    blog.selectorConfig
  )
}

export default newsScraperNasa
