// src/jobs/modules/news/news-links.module.ts
import { JobModule } from '@types'
import { createNewsLinksTask } from './news-links.task'
import { createNewsPagesTask } from './news-pages.task'
import { createNewsSummarizerTask } from './news-summary.task'
import { createNewsCategorizerTask } from './news-categorizer.task'

export const newsJobModules: JobModule[] = [
  {
    name: 'news_links',
    createJob: createNewsLinksTask,
  },
  {
    name: 'news_pages',
    createJob: createNewsPagesTask,
  },
  {
    name: 'news_summarizer',
    createJob: createNewsSummarizerTask,
  },
  {
    name: 'news_categorizer',
    createJob: createNewsCategorizerTask,
  },
]
