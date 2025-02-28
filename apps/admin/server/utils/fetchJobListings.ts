import axios from 'axios'
import * as cheerio from 'cheerio'

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

const jobSites: JobSite[] = [
  {
    name: 'ESA',
    url: 'https://jobs.esa.int',
    listingUrl:
      'https://jobs.esa.int/search/?createNewAlert=false&q=&locationsearch=&optionsFacetsDD_dept=&optionsFacetsDD_shifttype=&optionsFacetsDD_customfield4=&optionsFacetsDD_customfield3=',
    selectors: {
      jobContainer: '#job-tile-list li.job-tile',
      title: '.tiletitle a',
      location: '[id*="-section-multilocation-value"]',
      employment_type: '[id*="-section-shifttype-value"]',
      deadline: '[id*="-section-department-value"]',
      relativeUrl: '.tiletitle a',
      publish_date: 'span[data-careersite-propertyid="adcode"]',
      department: 'span[data-careersite-propertyid="dept"]',
      description: 'span[itemprop="description"]',
    },
  },
  {
    name: 'SKAO',
    url: 'https://recruitment.skao.int',
    listingUrl: 'https://recruitment.skao.int/vacancies.html',
    selectors: {
      jobContainer: '#jobs_list .jobCard',
      title: '.card-title a',
      location: 'li:contains("Job Location") .jovalue',
      employment_type: 'li:contains("Contract Type") .jovalue',
      deadline: 'li:contains("Closing Date") .class_value',
      relativeUrl: '.card-title a',
      department: 'li:contains("Area / Department") .jovalue',
      salary: 'li:contains("Salary") .jovalue',
    },
  },
  {
    name: 'Space Talent',
    url: 'https://jobs.spacetalent.org',
    listingUrl: 'https://jobs.spacetalent.org/',
    selectors: {
      jobContainer: '[data-testid="job-list-item"]',
      title: '[data-testid="job-title-link"] div[itemprop="title"]',
      location: '[itemprop="jobLocation"] meta[itemprop="address"]',
      employment_type: '[data-testid="job-title-link"] div.sc-dmqHEX',
      deadline: '',
      relativeUrl: '[data-testid="job-title-link"]',
      publish_date: '[itemprop="datePosted"]',
      department: '[data-testid="tag"] div.sc-dmqHEX.dncTlc',
      salary: '[data-testid="job-title-link"] ~ div p.sc-beqWaB.enQFes',
    },
  },
  {
    name: 'CERN',
    url: 'https://careers.cern',
    listingUrl: 'https://careers.cern/alljobs',
    selectors: {
      jobContainer: 'tr.srJobListJobOdd, tr.srJobListJobEven',
      title: 'td.srJobListJobTitle',
      location: 'td.srJobListLocation',
      employment_type: '[itemprop="employmentType"]',
      deadline: 'strong:contains("Job closing date")',
      relativeUrl: 'tr[onclick]',
      publish_date: 'meta[itemprop="datePosted"]',
      department: 'meta[itemprop="industry"]',
      description: '[itemprop="description"]',
      salary: 'li:contains("A monthly stipend ranging between")',
    },
  },
]

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

async function fetchJobDetails(job: JobListing, site: JobSite): Promise<JobListing> {
  try {
    const { data } = await axios.get(job.url)
    const $ = cheerio.load(data)

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

async function fetchJobListings(site: JobSite): Promise<JobListing[]> {
  try {
    const { data } = await axios.get(site.listingUrl)
    const $ = cheerio.load(data)

    let jobs: JobListing[] = []

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
      const department = cleanText($(site.selectors.department).text())
      const description = cleanText($(site.selectors.description).text())
      const salary = cleanText($(site.selectors.salary).text())

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

    jobs = await Promise.all(jobs.map((job) => fetchJobDetails(job, site)))

    return jobs
  } catch (error) {
    console.error(`Error fetching job listings from ${site.name}:`, error)
    return []
  }
}

export async function scrapeJobs(): Promise<JobListing[][]> {
  return Promise.all(jobSites.map(fetchJobListings))
}
