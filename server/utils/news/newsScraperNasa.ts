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
          // Adjust your logic based on the type of data you're extracting.
          // Example: Extracting text content
          // Switch case to handle different types of data based on the key.
          switch (key) {
            case 'featured_image':
              // Map each image element to its data representation.
              data[key] = {
                src: element.querySelector('img')?.getAttribute('src'), // Find the img element.
                alt: element.querySelector('img')?.getAttribute('alt') // Find the figcaption element.
              }
              break
            case 'author':
              // Extract and store the author's name and link.
              data[key] = {
                name: elements[0].textContent?.trim(),
                link: elements[0].getAttribute('href'),
                image: null // No image for the author in this case.
              }
              break
            case 'published':
              // Store the datetime attribute as the published date.
              data[key] = elements[0].getAttribute('datetime')
              break
            case 'body':
            case 'title':
              // Extract and format the text content for body and title.
              data[key] = elements[0].textContent?.replace(/\n/g, ' ').trim()
              // Extract the source article URL.
              data.srcArticle = elements[0].getAttribute('src')
              break
            default:
              // Handle other unspecified keys.
              data[key] = {
                name: elements[0].textContent?.trim(),
                link: elements[0].getAttribute('href')
              }
        }
        return data
      })
    }, blog.selectorConfig)
  console.log('articlesData', articlesData)
  return articlesData
}

export default newsScraperNasa
