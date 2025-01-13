import { JobServices } from '@types'
import { DatabaseUtils } from '../../utils/database.utils'
import { JobFactory } from '../../job.factory'
import { createClient, Agent, newsletterConfig, TIMEZONE_CONFIGS } from '@agents'

export const createNewsletterTask = (services: JobServices) => {
  const { logger, prisma } = services

  return JobFactory.createJob<NewsletterInput, NewsletterOutput, NewsletterOutput>({
    name: 'newsletter_generator',
    domain: 'news',
    version: '1.0.0',
    changes: ['Initial version'],
    schedule: {
      // Run every hour to check for timezone-specific newsletters
      customCron: '0 * * * *',
      type: 'cron',
      enabled: true,
    },
    priority: 'high',
    timeout: 300000, // 5 minutes
    handlers: {
      beforeProcess: async () => {
        const currentHour = new Date().getUTCHours()
        const activeTimezones = TIMEZONE_CONFIGS.filter((tz) => {
          const tzHour = (currentHour + parseInt(tz.offset.split(':')[0])) % 24
          return tzHour === 7 // Check if it's 7 AM in the timezone
        })

        if (activeTimezones.length === 0) {
          return [] // No newsletters needed this hour
        }

        const newsletterInputs: NewsletterInput[] = []

        for (const timezone of activeTimezones) {
          // Calculate the time range for the last 24 hours in the timezone
          const tzOffset = parseInt(timezone.offset.split(':')[0])
          const endDate = new Date()
          const startDate = new Date(endDate)
          startDate.setHours(startDate.getHours() - 24)

          // Fetch articles for the timezone
          const articles = await prisma.news.findMany({
            where: {
              published_at: {
                gte: startDate,
                lte: endDate,
              },
              content_status: 'published',
              has_summary: true,
            },
            include: {
              news_summaries: {
                where: {
                  is_current: true,
                },
              },
              categories: true,
            },
            orderBy: {
              published_at: 'desc',
            },
          })

          newsletterInputs.push({
            timezone,
            articles: articles.map((article) => ({
              id: article.id,
              title: article.title,
              summary: article.news_summaries[0]?.summary || article.description,
              category: article.categories[0]?.name || 'Uncategorized',
              published_at: article.published_at,
              url: article.url,
            })),
            template: DEFAULT_TEMPLATE,
          })
        }

        return newsletterInputs
      },

      processFunction: async (inputs: NewsletterInput[]): Promise<NewsletterOutput[]> => {
        const agent = new Agent(services, newsletterConfig)
        const results: NewsletterOutput[] = []

        for (const input of inputs) {
          try {
            const result = await agent.execute({
              data: {
                ...input,
                articles: input.articles.slice(0, 25), // Limit to top 25 articles
              },
            })

            const newsletter: NewsletterOutput = {
              id: crypto.randomUUID(),
              content: result.result,
              timezone: input.timezone.name,
              published_at: new Date(),
              metadata: {
                articleCount: input.articles.length,
                categories: [...new Set(input.articles.map((a) => a.category))],
                template: input.template.id,
              },
            }

            results.push(newsletter)
          } catch (error: any) {
            logger.error(`Failed to generate newsletter for ${input.timezone.name}`, { error })
          }
        }

        return results
      },

      afterProcess: async (results: NewsletterOutput[]): Promise<NewsletterOutput[]> => {
        try {
          await DatabaseUtils.executeTransaction({
            prisma,
            logger,
            operation: async (tx) => {
              for (const newsletter of results) {
                await tx.newsletters.create({
                  data: {
                    id: newsletter.id,
                    title: `Daily Space News - ${newsletter.timezone}`,
                    generated_content: newsletter.content,
                    content_status: 'published',
                    frequency: 'daily',
                    start_date: new Date(),
                    end_date: new Date(),
                    created_at: newsletter.published_at,
                    updated_at: newsletter.published_at,
                  },
                })
              }
            },
            maxRetries: 3,
            retryDelay: 1000,
          })

          return results
        } catch (error: any) {
          logger.error('Failed to save newsletters', {
            error,
            context: { count: results.length },
          })
          throw error
        }
      },

      onError: async (error: Error): Promise<void> => {
        logger.error(`Newsletter generation job failed`, { error })
      },
    },
  })
}
