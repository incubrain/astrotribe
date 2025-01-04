// src/jobs/modules/news/news-links.module.ts
import { JobModule } from '@types'
import { createNewsLinksJob } from './news-links.config'

export const newsLinksModule: JobModule = {
  name: 'news_links',
  createJob: createNewsLinksJob,
}
