import * as cheerio from 'cheerio'
import { chromium } from 'playwright'
import jobSites from './jobsites.json'

interface Company {
  name?: string
  jobs: JobListing[]
}

interface JobListing {
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

interface JobSite {
  name: string
  url: string
  listingUrl: string
  selectors: {
    jobContainer: string
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
          let scrollHeight = document.body.scrollHeight
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
  } catch (error) {
    console.warn(`Failed with 'networkidle', retrying with 'domcontentloaded'...`)
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      content = await page.content()
    } catch (error) {
      console.error(`Both 'domcontentloaded' and 'networkidle' failed for ${url}:`, error)
    }
  }

  await browser.close()

  if (content) {
    return cheerio.load(content)
  }

  return null
}

async function fetchJobDetails(job: JobListing, site: JobSite): Promise<JobListing | null> {
  try {
    const $ = await fetchPageWithJS(job.url)

    if (!$) return null

    job.title = job.title || cleanText($(site.selectors.title).text())
    job.publish_date =
      job.publish_date || formatDate(cleanText($(site.selectors.publish_date).text()))
    job.deadline = job.deadline || formatDate(cleanText($(site.selectors.deadline).text()))
    job.department = job.department || cleanText($(site.selectors.department).text())
    job.description = job.description || cleanText($(site.selectors.description).text())
    job.salary = job.salary || cleanText($(site.selectors.salary).text())
  } catch (error) {
    console.error(`Error fetching job details for ${job.url}:`, error)
  }
  return job
}

async function fetchJobListings(site: JobSite): Promise<Company> {
  try {
    const $ = await fetchPageWithJS(site.listingUrl)
    console.log(`Scraping ${site.listingUrl}`)
    let hasAllProps = false
    let jobs: JobListing[] = []

    if (!$) return { name: site.name, jobs: [] }

    $(site.selectors.jobContainer).each((_, element) => {
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

      jobs.push({
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
      jobs = (await Promise.all(jobs.map((job) => fetchJobDetails(job, site)))).filter(
        (job): job is JobListing => !!job,
      )
    }

    return { name: site.name, jobs }
  } catch (error) {
    console.error(`Error fetching job listings from ${site.name}:`, error)
    return { name: site.name, jobs: [] }
  }
}

export async function scrapeJobs(): Promise<Company[]> {
  return Promise.all((jobSites as JobSite[]).map(fetchJobListings))
}
