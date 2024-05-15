import { z } from 'zod'
import { Groq } from 'groq-sdk'
import * as cheerio from 'cheerio'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

async function fetchHTML(url: string): Promise<string> {
  return await $fetch(url, {
    method: 'GET'
  })
}

const normalizeBaseUrl = (url: string) => (url = url.endsWith('/') ? url.slice(0, -1) : url)

function prepareLink(baseUrl: string, link: string): string {
  // Check if the link is relative (starting with '/')
  if (link.startsWith('/')) {
    return `${baseUrl}${link}` // Append base URL to the relative path
  }
  return link // Return the link as is if it's already absolute
}

// Function to clean up and normalize the text
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace characters with a single space
    .replace(/[\r\n]+/g, ' ') // Remove new lines and carriage returns, replace with space
    .trim() // Trim whitespace from start and end of the text
}

export async function fetchWebPageText(url: string): Promise<string> {
  try {
    url = normalizeBaseUrl(url) // Normalize the base URL
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)

    // Remove all script and style elements to clean up the HTML
    $('script, style').remove()

    // Extract and clean all text from the webpage
    return cleanText($('body').text())
  } catch (error) {
    console.error('Error fetching web page text:', error)
    throw error // Re-throw the error after logging it
  }
}

async function checkAndFilterLinks(links: string[]) {
  const workingLinks = []

  for (const link of links) {
    try {
      // Use ofetch with the HEAD method to check if the link is valid
      const response = await $fetch.raw(link, {
        method: 'HEAD',
        ignoreResponseError: true // to handle non-2xx responses without throwing an error
      })
      if (response.ok) {
        // Checks if the response status is 2xx
        workingLinks.push(link)
      }
    } catch (error) {
      console.log(`Error checking link: ${link} with error: ${error.message}`)
      // Optionally handle error, e.g., retry logic
    }
  }

  return workingLinks
}

export async function fetchAndValidateWebPageLinks(url: string): Promise<string[]> {
  try {
    url = normalizeBaseUrl(url)
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)
    let links = $('a')
      .map((_, element) => $(element).attr('href'))
      .get()
      .map((link) => prepareLink(url, link))
      .filter((link) => link && link.includes(url)) // Keep only links that include the base URL

    links.push(url)
    // Validate links by checking their availability
    return await checkAndFilterLinks(links)
  } catch (error) {
    console.error('Error fetching or validating links:', error)
    throw error
  }
}

const linksSchema = z.array(z.string())

interface Product {
  name: string | null
  url: string | null
  price: string | null
}

interface Address {
  address_type: string | null
  is_primary: boolean | null
  name: string | null
  street1: string | null
  street2: string | null
  country: string | null
  city: string | null
}

interface BasicInfo {
  name: string | null
  description: string | null
  founding_year: number | null
  website_url: string | null
}

interface ContactDetails {
  addresses: Address[] // Assume Address is already defined
  phone: string | null
  email: string | null
}

interface SocialMediaLinks {
  facebook: string | null
  twitter: string | null
  linkedin: string | null
  instagram: string | null
  youtube: string | null
}

interface FinancialInfo {
  revenue: string | null
  funding: string | null
  market_cap: string | null
}

interface OperationalDetails {
  employee_count: number | null
  headquarters: string | null
  branches: Address[] // Assume Address is already defined
}

// CompanyData object that combines all segments
interface CompanyData {
  basicInfo: BasicInfo
  contactDetails: ContactDetails
  socialMedia: SocialMediaLinks
  financialInfo: FinancialInfo
  operationalDetails: OperationalDetails
}

interface ResearchDevelopment {
  projects: string[] | null
  partnerships: string[] | null
  publications: string[] | null
}

interface ProductsServices {
  list: Array<{ name: string; description: string; url: string }> | null
}

interface InvestmentDetails {
  rounds: Array<{ roundType: string; amount: string; date: string }> | null
  investors: string[] | null
  futurePlans: string | null
}

interface CareerOpportunities {
  jobOpenings: Array<{ title: string; description: string; url: string }> | null
  internships: string[] | null
}

// Updated CompanyData object to include new segments
interface CompanyData {
  basicInfo: BasicInfo
  contactDetails: ContactDetails
  socialMedia: SocialMediaLinks
  financialInfo: FinancialInfo
  operationalDetails: OperationalDetails
  researchDevelopment: ResearchDevelopment
  productsServices: ProductsServices
  investmentDetails: InvestmentDetails
  careerOpportunities: CareerOpportunities
  upcomingEvents: Array<{ name: string; date: string; location: string; url: string }> | null
}

function initializeCompanyData(): CompanyData {
  return {
    basicInfo: {
      name: null,
      description: null,
      founding_year: null,
      website_url: null
    },
    contactDetails: {
      addresses: [],
      phone: null,
      email: null
    },
    socialMedia: {
      facebook: null,
      twitter: null,
      linkedin: null,
      instagram: null,
      youtube: null
    },
    financialInfo: {
      revenue: null,
      funding: null,
      market_cap: null
    },
    operationalDetails: {
      employee_count: null,
      headquarters: null,
      branches: []
    },
    researchDevelopment: {
      projects: [],
      partnerships: [],
      publications: []
    },
    productsServices: {
      list: []
    },
    investmentDetails: {
      rounds: [],
      investors: [],
      futurePlans: null
    },
    careerOpportunities: {
      jobOpenings: [],
      internships: []
    },
    upcomingEvents: []
  }
}

const systemMessages = {
  basicInfo: `
  Extract basic company information as 
  basicInfo: {
    name: null,
    description: null,
    founding_year: null,
    website_url: null
  }.`,

  contactDetails: `
  Gather all available contact details as 
  contactDetails: {
    addresses: [{
      address_type: string(headquarters, office, factory, lab, showroom),
      name: string | null,
      street1: string,
      street2: string,
      country: string,
      city: string
    }],
    contacts: [{
      type: string(hiring, customers, support),
      name: string,
      phone: number,
      email: string
    }]
  }`,

  financialInfo: `
  Collect financial data including revenue figures, funding received, and market capitalization if available as 
  financialInfo: {
    revenue: string | null,
    funding: string | null,
    market_cap: string | null
  }.`,

  operationalDetails: `
  Detail operational metrics like employee count, location of headquarters, and branch offices as 
  operationalDetails: {
          employee_count: number | null,
          headquarters: string | null,
          branches: [{
            address_type: string(headquarters, branch, other),
            name: string | null,
            street1: string,
            street2: string,
            country: string,
            city: string
          }]
        }.`,

  researchDevelopment: `
  Identify key research projects, partnerships with other entities, and any notable publications as 
  researchDevelopment: {
    projects: string[] | null,
    partnerships: string[] | null,
    publications: string[] | null
  }.`,

  productsServices: `
  Compile a list of main products and services offered by the company, including descriptions and URLs as 
  productsServices: {
    list: [{
      name: string,
      description: string,
      url: string
    }]
  }.`,

  investmentDetails: `
  Record details of investment rounds, names of key investors, and future financial planning as 
  investmentDetails: {
    rounds: [{
      roundType: string,
      amount: string,
      date: string
    }],
    investors: string[] | null,
    futurePlans: string | null
  }.`,

  careerOpportunities: `
  List current job openings and available internship opportunities as
  careerOpportunities: {
    jobOpenings: [{
      title: string,
      description: string,
      url: string
    }],
    internships: string[] | null
  }.`,

  eventsOutreach: `
    Document upcoming company events such as conferences, webinars, and outreach programs as
      upcomingEvents: [{
        name: string,
        date: string,
        location: string,
        url: string
      }],
    `
}

let companyData = initializeCompanyData()
// Function to fetch website and sitemap information

function isDataComplete(segmentData: any): boolean {
  // This is an example for a segment with optional and required fields
  // You would customize the logic based on your data structure
  if (segmentData instanceof Array) {
    return segmentData.length > 0 // Check if any objects are in the array
  } else {
    for (let key in segmentData) {
      if (
        segmentData[key] === null ||
        (Array.isArray(segmentData[key]) && segmentData[key].length === 0)
      ) {
        return false // Returns false if any field is null or any array is empty
      }
    }
    return true
  }
}

// company social media to social_media: {
//   facebook: null,
//   instagram: null,
//   twitter: null,
//   linkedin: null,
//   youtube: null
// }, and remove remaining links,

export async function fetchBusinessInfo(url: string) {
  const allResponses = []
  let companyData = initializeCompanyData() // Assuming this function initializes your company data structure

  try {
    const links = await fetchAndValidateWebPageLinks(url)
    const message = `links: ${JSON.stringify(links)}`
    // companyData.social_media = JSON.parse(linkResponse.choices[0].message.content).social_media
    console.log('Link Response:', message)

    // Parse links
    // allResponses.push(linkResponse.choices[0].message.content)
    // const websiteLinks = linksSchema.parse(
    //   JSON.parse(linkResponse.choices[0].message.content).links
    // )
    // console.log('Website Links:', websiteLinks)

    // Iterate over each section of the company data based on systemMessages keys
    const storage = useStorage('companies')
    let storeObj = {}
    for (const sectionKey of Object.keys(systemMessages)) {
      const filterLinksSystemMessage = `
          Select the top 4 urls by order of research importance for the ${sectionKey} topic
          respond as JSON string array:`
      const linkResponse = await getGroqChatCompletionTest(filterLinksSystemMessage, message)
      console.log('linkResponse', linkResponse.choices[0].message.content)
      const newLinks = JSON.parse(linkResponse.choices[0].message.content)
      
      if (!Array.isArray(newLinks)) {
        console.log('LINKS ARE NOT ARRAY')
        break
      }

      newLinks.push(url)
      storeObj[sectionKey] = []
      for (const link of newLinks) {
        console.log('Fetching link:', link, sectionKey)
        const moreHTML = await fetchWebPageText(link)
        await new Promise((reslove) => setTimeout(reslove, 5000))
        const nextSystemMessage = `Your are a business research analyst ${systemMessages[sectionKey]}, respond as JSON:`
        const moreResponse = await getGroqChatCompletionTest(
          nextSystemMessage,
          `Search this text: ${moreHTML}`
        )
        storeObj[sectionKey].push(JSON.parse(moreResponse.choices[0].message.content))

        allResponses.push(JSON.parse(moreResponse.choices[0].message.content))
        // sectionData = updateObject(
        //   sectionData,
        //   JSON.parse(moreResponse.choices[0].message.content)
        // )
        // console.log('Updated Section Data:', sectionData)

        // if (isDataComplete(sectionData)) {
        //   companyData[sectionKey] = sectionData
        //   break // Exit the loop if data is complete
        // }
      }
      storage.setItem(`${sectionKey}`, storeObj[sectionKey])

      // }
    }

    console.log('Full Company Data:', companyData)
    return companyData
  } catch (error) {
    console.error('Failed to fetch or validate business info:', error)
    throw error // Re-throw to handle the error appropriately outside this function
  }
}

export async function getGroqChatCompletionTest(systemMessage: string, message: string) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: message
      }
    ],
    model: 'llama3-70b-8192',
    temperature: 0.3,
    max_tokens: 1500,
    top_p: 0.6,
    stream: false,
    response_format: { type: 'json_object' }
  })
}
