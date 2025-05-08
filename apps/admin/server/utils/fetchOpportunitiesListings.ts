import * as cheerio from 'cheerio'
import { chromium } from 'playwright'
import opportunitiesSites from './opportunitiessites.json'

interface Company {
  name?: string
  opportunitiess: OpportunitiesListing[]
}

interface OpportunitiesListing {
  title: string
  location: string
  employment_type: string
  publish_date?: string
  deadline: string
  department?: string
  description?: string
  salary?: string
  url: string
}

interface OpportunitiesSite {
  name: string
  url: string
  listingUrl: string
  selectors: {
    opportunitiesContainer: string
    title: string
    location: string
    employment_type: string
    deadline: string
    relativeUrl: string
    publish_date?: string
    department?: string
    description?: string
    salary?: string
  }
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function formatDate(dateString: string): string {
  const dateParts = dateString.match(/(\d{1,2}) (\w+) (\d{4})/)
  if (dateParts) {
    return `${dateParts[1]} ${dateParts[2]} ${dateParts[3]}`
  }
  return dateString
}

async function fetchPageWithJS(url: string): Promise<cheerio.CheerioAPI | null> {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  let content: string | null = null

  try {
    // Try with "domcontentloaded" first
    await page.goto(url, { waitUntil: 'networkidle' })

    await page.waitForFunction(() => document.readyState === 'complete')
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve(true)
          }
        }, 200)
      })
    })

    content = await page.content()
  } catch (error: any) {
    console.warn("Failed with 'networkidle', retrying with 'domcontentloaded'...")
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      content = await page.content()
    } catch (error: any) {
      console.error(`Both 'domcontentloaded' and 'networkidle' failed for ${url}:`, error)
    }
  }

  await browser.close()

  if (content) {
    return cheerio.load(content)
  }

  return null
}

async function fetchOpportunitiesDetails(opportunities: OpportunitiesListing, site: OpportunitiesSite): Promise<OpportunitiesListing | null> {
  try {
    const $ = await fetchPageWithJS(opportunities.url)

    if (!$) return null

    opportunities.title = opportunities.title || cleanText($(site.selectors.title).text())
    opportunities.publish_date =
      opportunities.publish_date || formatDate(cleanText($(site.selectors.publish_date).text()))
    opportunities.deadline = opportunities.deadline || formatDate(cleanText($(site.selectors.deadline).text()))
    opportunities.department = opportunities.department || cleanText($(site.selectors.department).text())
    opportunities.description = opportunities.description || cleanText($(site.selectors.description).text())
    opportunities.salary = opportunities.salary || cleanText($(site.selectors.salary).text())
  } catch (error: any) {
    console.error(`Error fetching opportunities details for ${opportunities.url}:`, error)
  }
  return opportunities
}

async function fetchOpportunitiesListings(site: OpportunitiesSite): Promise<Company> {
  try {
    const $ = await fetchPageWithJS(site.listingUrl)
    console.log(`Scraping ${site.listingUrl}`)
    let hasAllProps = false
    let opportunitiess: OpportunitiesListing[] = []

    if (!$) return { name: site.name, opportunitiess: [] }

    $(site.selectors.opportunitiesContainer).each((_, element) => {
      const title = cleanText($(element).find(site.selectors.title).first().text())
      const publish_date = formatDate(cleanText($(site.selectors.publish_date).text()))
      const location = cleanText($(element).find(site.selectors.location).first().text())
      const employment_type = cleanText(
        $(element).find(site.selectors.employment_type).first().text(),
      )
      const deadline = formatDate(
        cleanText($(element).find(site.selectors.deadline).first().text()),
      )
      const relativeUrl = $(element).find(site.selectors.relativeUrl).attr('href')
      const url =
        relativeUrl && relativeUrl?.startsWith('http') ? relativeUrl : `${site.url}${relativeUrl}`
      const department = cleanText($(element).find(site.selectors.department).text())
      const description = cleanText($(element).find(site.selectors.description).text())
      const salary = cleanText($(element).find(site.selectors.salary).text())

      hasAllProps = [
        title,
        location,
        department,
        description,
        salary,
        publish_date,
        employment_type,
        deadline,
        url,
      ].every((value) => value)

      opportunitiess.push({
        title,
        location,
        department,
        description,
        salary,
        publish_date,
        employment_type,
        deadline,
        url,
      })
    })

    if (!hasAllProps) {
      opportunitiess = (await Promise.all(opportunitiess.map((opportunities) => fetchOpportunitiesDetails(opportunities, site)))).filter(
        (opportunities): opportunities is OpportunitiesListing => !!opportunities,
      )
    }

    return { name: site.name, opportunitiess }
  } catch (error: any) {
    console.error(`Error fetching opportunities listings from ${site.name}:`, error)
    return { name: site.name, opportunitiess: [] }
  }
}

export async function scrapeOpportunitiess(): Promise<Company[]> {
  return Promise.all((opportunitiesSites as OpportunitiesSite[]).map(fetchOpportunitiesListings))
}
