// src/jobs/modules/news/news-links.module.ts
import { JobModule } from '@types'
import { createNewsLinksJob } from './news-links.config'
import { createNewsPagesJob } from './news-pages.config'

export const newsJobModules: JobModule[] = [
  {
    name: 'news_links',
    createJob: createNewsLinksJob,
  },
  {
    name: 'news_pages',
    createJob: createNewsPagesJob,
  },
]
