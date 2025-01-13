// src/jobs/config/news/news-categorizer.config.ts
import {   } from '@astronera/db'
import { Agent, AgentConfig } from '@agents'
import { JobFactory } from '../../job.factory'
import { DatabaseUtils } from '../../utils/database.utils'
import { JobServices } from '@types'

interface NewsCategorizerInput {
  id: string
  title: string
  body: string
  summary: string
}

interface CategoryAssignment {
  category_id: number
  confidence: number
  reasoning: string
}

interface TagAssignment {
  tag_id: number
  confidence: number
}

interface ProcessedContent {
  article_id: string
  category: CategoryAssignment
  tags: TagAssignment[]
}

export const categorizerConfig: AgentConfig = {
  name: 'news-categorizer',
  taskDescription: 'Analyze news articles to assign categories and tags',

  systemPrompt: `You are a specialized AI assistant that analyzes astronomy and space science content to assign appropriate categories and tags. Analyze the provided article content and:

1. Identify the primary topic and themes
2. Select the most appropriate category from the available list
3. Choose 3-5 relevant tags from the provided taxonomy
4. Provide confidence scores and reasoning

Core focus areas to consider:
- Space exploration and missions
- Scientific discoveries and research
- Technological developments
- Industry and commercial space
- Space policy and regulations
- Astronomical events and observations

For each article, provide:
- One primary category with confidence score
- 3-5 relevant tags with confidence scores
- Brief reasoning for category selection`,

  userPrompt: `Please analyze this article and provide category and tag assignments:

Title: {{title}}
Summary: {{summary}}
Body: {{body}}

Return a JSON object with:
{
  "category": {
    "id": number,
    "confidence": number,
    "reasoning": string
  },
  "tags": [
    {
      "id": number,
      "confidence": number
    }
  ]
}`,

  openAIModel: 'gpt-4o-mini',
  maxRetries: 2,
}

export const createNewsCategorizerTask = (services: JobServices) => {
  const { logger, prisma } = services

  return JobFactory.createJob<NewsArticle, ProcessedContent, ProcessedContent>({
    name: 'news_categorizer',
    domain: 'news',
    version: '1.0.0',
    changes: ['Initial version'],
    schedule: {
      customCron: '*/30 * * * *', // Every 30 minutes
      type: 'cron',
      enabled: true,
    },
    priority: 'low',
    timeout: 300000, // 5 minutes
    handlers: {
      beforeProcess: async () => {
        try {
          const articles = await prisma.News.findMany({
            where: {
              content_status: 'published',
              category_id: null,
            },
            select: {
              id: true,
              title: true,
              body: true,
              description: true,
            },
            take: 10,
          })

          return DatabaseUtils.convertBigIntToNumber(articles)
        } catch (error: any) {
          logger.error('Failed to fetch uncategorized articles', { error })
          throw error
        }
      },

      processFunction: async (articles: NewsArticle[]): Promise<ProcessedContent[]> => {
        const agent = new Agent(services, categorizerConfig)
        const results: ProcessedContent[] = []

        await DatabaseUtils.batchProcess({
          items: articles,
          batchSize: 5,
          processor: async (batch) => {
            for (const article of batch) {
              try {
                // Prepare input for the agent
                const input = {
                  title: article.title,
                  summary: article.description || '',
                  body: article.body || '',
                }

                // Get agent's categorization
                const result = await agent.execute({ data: input })
                const categorization = JSON.parse(result.result)

                results.push({
                  article_id: article.id,
                  category: categorization.category,
                  tags: categorization.tags,
                })
              } catch (error: any) {
                logger.error(`Failed to categorize article ${article.id}`, { error })
              }
            }
            return results
          },
          logger,
        })

        return results
      },

      afterProcess: async (results: ProcessedContent[]): Promise<ProcessedContent[]> => {
        try {
          await DatabaseUtils.executeTransaction({
            prisma,
            logger,
            operation: async (tx) => {
              // Update categories
              for (const result of results) {
                await tx.news.update({
                  where: { id: result.article_id },
                  data: {
                    category_id: result.category.category_id,
                    updated_at: new Date(),
                  },
                })

                // Create content-tag relationships
                const contentTags = result.tags.map((tag) => ({
                  content_id: result.article_id,
                  tag_id: tag.tag_id,
                }))

                await tx.content_tags.createMany({
                  data: contentTags,
                  skipDuplicates: true,
                })
              }
            },
            maxRetries: 3,
            retryDelay: 1000,
          })

          return results
        } catch (error: any) {
          logger.error('Failed to save categorization results', {
            error,
            context: { resultsCount: results.length },
          })
          throw error
        }
      },

      onError: async (error: Error): Promise<void> => {
        logger.error(`News categorizer job failed`, {
          error,
        })
      },
    },
  })
}
