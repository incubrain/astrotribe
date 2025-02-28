import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { scrapeJobs } from '../utils/fetchJobListings'

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)

    const companies = await scrapeJobs()

    companies.forEach((jobs: any) => jobs.forEach((job: any) => console.log(job.title)))

    Promise.all(
      companies.map((jobs) =>
        jobs.map(async (job) => {
          const { data: content, error } = await supabase
            .from('contents')
            .insert({
              content_type: 'jobs',
              title: job.title,
              url: job.url,
            })
            .select()
            .single()

          console.error('Error inserting into contents', error)

          if (content) {
            const { data: jobData, error: jobError } = await supabase
              .from('jobs')
              .insert({
                contents_id: content.id,
                title: job.title,
                url: job.url,
                location: job.location,
                description: job.description,
                published_at: job.publish_date && new Date(job.publish_date),
                expires_at: job.deadline && new Date(job.deadline),
                employment_type: job.employment_type,
              })
              .select()
              .single()

            console.error('Error inserting into jobs', jobData)
          }
        }),
      ),
    )
  } catch (error: any) {
    console.log('Error', error)
  }
})
