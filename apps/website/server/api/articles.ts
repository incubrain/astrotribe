// server/api/articles.ts
import { defineEventHandler, getQuery } from 'h3'
import { serverQueryContent } from '#content/server'
import { ARTICLE_CARD_PROPERTIES } from '~/types/articles'

export default defineEventHandler(async (event) => {
  const { category, limit, skip } = getQuery(event)

  let query = serverQueryContent(event, 'blog')
    .where({ status: 'published' })
    .only(ARTICLE_CARD_PROPERTIES)
    .sort({ publishedAt: -1 })

  if (category && category !== 'all') {
    query = query.where({ category })
  }

  if (skip) {
    query = query.skip(Number(skip))
  }

  if (limit) {
    query = query.limit(Number(limit))
  }

  const articles = await query.find()

  return articles
})
