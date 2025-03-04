import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { scrapeJobs } from '../utils/fetchJobListings'
import { parse } from 'date-fns'

const parseDate = (dateStr: string): Date | null => {
  const formats = [
    'd MMMM yyyy', // 26 February 2025
    'dd/MM/yyyy', // 20/02/2025 (European format)
    'MM/dd/yyyy', // 02/20/2025 (US format)
    'yyyy-MM-dd', // 2025-02-26 (ISO)
    'MMMM d, yyyy', // February 26, 2025
  ]

  for (const formatStr of formats) {
    try {
      const parsedDate = parse(dateStr, formatStr, new Date())
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    } catch (e) {
      continue
    }
  }

  console.warn(`❌ Unable to parse date: ${dateStr}`)
  return null
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)

    const companies = await scrapeJobs()

    companies.forEach((company: any) =>
      company.jobs.length
        ? company.jobs.forEach((job: any) => console.log(job.title))
        : console.log(`No jobs found for ${company.name}`),
    )

    Promise.all(
      companies.map((company: any) =>
        company.jobs.map(async (job: any) => {
          const { data: content, error } = await supabase
            .from('contents')
            .insert({
              content_type: 'jobs',
              title: job.title,
              url: job.url,
            })
            .select()
            .single()

          if (error) console.error('Error inserting into contents', error)

          let company_id = null

          if (company.name) {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('id')
              .eq('name', company.name)

            company_id = companyData?.id
          }

          if (content) {
            const { data: jobData, error: jobError } = await supabase
              .from('jobs')
              .insert({
                contents_id: content.id,
                title: job.title,
                url: job.url,
                company_id,
                location: job.location,
                description: job.description,
                ...(job.publish_date ? { published_at: parseDate(job.publish_date) } : {}),
                ...(job.deadline ? { expires_at: parseDate(job.deadline) } : {}),
                employment_type: job.employment_type,
              })
              .select()
              .single()

            if (error) console.error('Error inserting into jobs', jobData)
          }
        }),
      ),
    )
  } catch (error: any) {
    console.log('Error', error)
  }
})
