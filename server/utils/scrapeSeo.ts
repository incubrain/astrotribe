import axios from 'axios-https-proxy-fix'
import { z } from 'zod'
import keywords from '@/server/utils/openai/categories.json'

// Create schema using zod
const RelatedSchema = z.array(
  z.object({
    text: z.string(),
    list_group: z.boolean().optional(),
    expanded: z.boolean().optional(),
    image: z.string().optional(),
    image_url: z.string().optional(),
    rank: z.number(),
    global_rank: z.number(),
    link: z.string().optional(),
    more_link: z.string().optional(),
    more_text: z.string().optional()
  })
)

const PeopleAlsoAskSchema = z.object({
  question: z.string(),
  answer_link: z.string(),
  answers: z.array(z.any()), // This can be further specified based on the structure of answers
  rank: z.number(),
  global_rank: z.number()
})

const ResponseSchema = z.object({
  general: z.unknown().optional(),
  organic: z.array(z.unknown()).optional(),
  related: RelatedSchema.optional(),
  top_ads: z.array(z.unknown()).optional(),
  bottom_ads: z.array(z.unknown()).optional(),
  jackpot_pla: z.array(z.unknown()).optional(),
  top_pla: z.array(z.unknown()).optional(),
  people_also_ask: z.array(PeopleAlsoAskSchema).optional()
})

// Configuration
const config = {
  testMode: true, // Turn testing on
  testNumber: 10, // # Results you want to scrape
  testKeyword: 'Best Telescopes', // Your test keyword here
  prodNumber: 2 // # Results you want to scrape
}

const domains = [
  {
    domain: 'google',
    countries: [
      { name: 'New Zealand', code: 'gl=nz' },
      { name: 'Australia', code: 'gl=au' },
      { name: 'India', code: 'gl=in' }
    ]
  },
  {
    domain: 'bing',
    countries: [
      { name: 'New Zealand', code: 'cc=nz' },
      { name: 'Australia', code: 'cc=au' },
      { name: 'India', code: 'cc=in' }
    ]
  }
]

// Refactoring for modularity: separate function to process a keyword
async function processKeyword(
  domain: string,
  country: { code: string; name: string },
  keyword: string,
  amount: number,
  options: any
): Promise<any> {
  const url = `https://www.${domain}.com/search?q=${encodeURIComponent(keyword)}&num=${String(
    amount
  )}&${country.code}&lum_json=1`

  try {
    const response = await axios.get(url, options)
    console.log('Response:', response.data)
    const parsed = ResponseSchema.parse(response.data) // Use zod to validate and parse the data
    console.log('Response Parsed:')

    const general = parsed.general
    const ads = {
      top_ads: parsed.top_ads || [],
      bottom_ads: parsed.bottom_ads || [],
      jackpot_pla: parsed.jackpot_pla || [],
      top_pla: parsed.top_pla || []
    }
    const organic = parsed.organic.map((o: any) => {
      return {
        link: o.link,
        title: o.title,
        rank: o.rank,
        global_rank: o.global_rank
      }
    })

    const client = useClient()

    console.log('Sending Parsed Data')
    const returnedData = await client.seo_data.create({
      data: {
        keyword,
        country: country.name,
        date: new Date(),
        general: JSON.stringify(general),
        organic: JSON.stringify(organic),
        ads: JSON.stringify(ads),
        domain
      }
    })
    console.log('Returned Data:', returnedData)
  } catch (error: any) {
    console.error(`Error with keyword "${keyword}" and URL "${url}": ${error.message}`)
    throw error
  }
}

async function scrapeSeo() {
  const env = useRuntimeConfig()

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const options = {
      proxy: {
        auth: {
          username: env.BRIGHT_DATA_SERP_USER,
          password: env.BRIGHT_DATA_SERP_PASS
        },
        host: 'brd.superproxy.io',
        port: 22225
      },
      rejectUnauthorized: false
    }

    // Async/Await in Loops: Using Promise.all() to execute multiple promises concurrently.
    if (config.testMode) {
      // Test with the first domain and country in your list
      await processKeyword(
        domains[0].domain,
        domains[0].countries[0],
        config.testKeyword,
        config.testNumber,
        options
      )
    } else {
      // Iterate through each domain and country
      for (const { domain, countries } of domains) {
        for (const country of countries) {
          await Promise.all(
            keywords.map((keyword) =>
              processKeyword(domain, country, keyword.name, config.prodNumber, options)
            )
          )
        }
      }
    }

    console.log('SEO scraped')
  } catch (error: any) {
    throw createError(`error scraping seo: ${error.message}`)
  }
}

export default scrapeSeo
