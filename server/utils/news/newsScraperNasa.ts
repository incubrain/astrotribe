import { Page } from 'playwright'
import { Blog, SelectorConfig } from './newsBlogs'

// Asynchronous function specific to scraping NASA's blog using Playwright.
const newsScraperNasa = async (page: Page, blog: Blog) => {
  // Navigate to the blog's URL.

  console.log('blog.url', blog.url)
  await page.goto(blog.url, { waitUntil: 'domcontentloaded' })
  const articlesData = await page
    .locator(blog.selectorBase)
    .evaluateAll((articles, selectorConfig: SelectorConfig) => {
      console.log('articles', articles, selectorConfig)
      return articles.map((article) => {
        const data: { [key: string]: any } = {}
        for (const key in selectorConfig) {
          const selector = selectorConfig[key as keyof SelectorConfig]
          if (!selector) {
            console.log('No selector for', key)
            data[key] = null
            continue
          } // Ensure there's a selector to use.
          const element = article.querySelector(selector)

          if (!element) {
            console.log('No element for', key)
            data[key] = null
            continue
          } // Ensure there's an element to extract data from.
          // Adjust your logic based on the type of data you're extracting.
          // Example: Extracting text content
          // Switch case to handle different types of data based on the key.
          console.log('element', element, key)
          switch (key) {
            case 'featured_image':
              data[key] = {
                src: element?.getAttribute('src') || null, // Find the img element.
                alt: element?.getAttribute('alt') || null // Find the figcaption element.
              }
              break
            case 'author':
              // Extract and store the author's name and link.
              data[key] = {
                name: element.textContent?.trim(),
                link: element.getAttribute('href'),
                image: null // No image for the author in this case.
              }
              break
            case 'published_at':
              // Store the datetime attribute as the published date.
              data[key] = element.getAttribute('datetime')
              break
            case 'body':
            case 'title':
              // Extract and format the text content for body and title.
              data[key] = element.textContent?.replace(/\n/g, ' ').trim()
              // Extract the source article URL.
              break
            default:
              // Handle other unspecified keys.
              data[key] = element.textContent?.trim()
              break
          }
        }
        return data
      })
    }, blog.selectorConfig)
  console.log('articlesData', articlesData)
  return articlesData
}

export default newsScraperNasa
