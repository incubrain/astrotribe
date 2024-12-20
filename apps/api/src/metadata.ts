export default async () => {
  const t = {}
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./core/dto/pagination.dto'),
          {
            PaginationParams: {
              page: { required: false, type: () => Number, default: 1 },
              limit: { required: false, type: () => Number, default: 10 },
              sort: { required: false, type: () => String },
              search: { required: false, type: () => String },
              order: { required: false, type: () => String },
              include: { required: false, type: () => Object },
            },
          },
        ],
      ],
      controllers: [
        [import('./core/base/base.controller'), { BaseController: {} }],
        [
          import('./content/controllers/research-embeddings.controller'),
          {
            ResearchEmbeddingController: {
              findAllResearchEmbeddings: { type: Object },
              findOneResearchEmbeddings: { type: Object },
              createResearchEmbeddings: { type: Object },
              updateResearchEmbeddings: { type: Object },
              removeResearchEmbeddings: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/embedding-reviews.controller'),
          {
            EmbeddingReviewController: {
              findAllEmbeddingReviews: { type: Object },
              findOneEmbeddingReviews: { type: Object },
              createEmbeddingReviews: { type: Object },
              updateEmbeddingReviews: { type: Object },
              removeEmbeddingReviews: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content-categories.controller'),
          {
            ContentCategoryController: {
              findAllContentCategories: { type: Object },
              findOneContentCategories: { type: Object },
              createContentCategories: { type: Object },
              updateContentCategories: { type: Object },
              removeContentCategories: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content-tags.controller'),
          {
            ContentTagController: {
              findAllContentTags: { type: Object },
              findOneContentTags: { type: Object },
              createContentTags: { type: Object },
              updateContentTags: { type: Object },
              removeContentTags: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content-statuses.controller'),
          {
            ContentStatusController: {
              findAllContentStatuses: { type: Object },
              findOneContentStatuses: { type: Object },
              createContentStatuses: { type: Object },
              updateContentStatuses: { type: Object },
              removeContentStatuses: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/newsletters.controller'),
          {
            NewsletterController: {
              findAllNewsletters: { type: Object },
              findOneNewsletters: { type: Object },
              createNewsletters: { type: Object },
              updateNewsletters: { type: Object },
              removeNewsletters: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/research.controller'),
          {
            ResearchController: {
              findAllResearch: { type: Object },
              findOneResearch: { type: Object },
              createResearch: { type: Object },
              updateResearch: { type: Object },
              removeResearch: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/categories.controller'),
          {
            CategoryController: {
              findAllCategories: { type: Object },
              findOneCategories: { type: Object },
              createCategories: { type: Object },
              updateCategories: { type: Object },
              removeCategories: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/feed-categories.controller'),
          {
            FeedCategoryController: {
              findAllFeedCategories: { type: Object },
              findOneFeedCategories: { type: Object },
              createFeedCategories: { type: Object },
              updateFeedCategories: { type: Object },
              removeFeedCategories: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/feeds.controller'),
          {
            FeedController: {
              findAllFeeds: { type: Object },
              findOneFeeds: { type: Object },
              createFeeds: { type: Object },
              updateFeeds: { type: Object },
              removeFeeds: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content-sources.controller'),
          {
            ContentSourceController: {
              findAllContentSources: { type: Object },
              findOneContentSources: { type: Object },
              createContentSources: { type: Object },
              updateContentSources: { type: Object },
              removeContentSources: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/tags.controller'),
          {
            TagController: {
              findAllTags: { type: Object },
              findOneTags: { type: Object },
              createTags: { type: Object },
              updateTags: { type: Object },
              removeTags: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/news.controller'),
          {
            NewsController: {
              findAllNews: { type: Object },
              findOneNews: { type: Object },
              createNews: { type: Object },
              updateNews: { type: Object },
              removeNews: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/news-tags.controller'),
          {
            NewsTagController: {
              findAllNewsTags: { type: Object },
              findOneNewsTags: { type: Object },
              createNewsTags: { type: Object },
              updateNewsTags: { type: Object },
              removeNewsTags: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content-source-visits.controller'),
          {
            ContentSourceVisitController: {
              findAllContentSourceVisits: { type: Object },
              findOneContentSourceVisits: { type: Object },
              createContentSourceVisits: { type: Object },
              updateContentSourceVisits: { type: Object },
              removeContentSourceVisits: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/feed-sources.controller'),
          {
            FeedSourceController: {
              findAllFeedSources: { type: Object },
              findOneFeedSources: { type: Object },
              createFeedSources: { type: Object },
              updateFeedSources: { type: Object },
              removeFeedSources: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/content.controller'),
          {
            ContentController: {
              getAllContent: {},
              findOneContents: { type: Object },
              createContents: { type: Object },
              updateContents: { type: Object },
              removeContents: { type: Object },
            },
          },
        ],
        [
          import('./content/controllers/news-summaries.controller'),
          {
            NewsSummaryController: {
              findAllNewsSummaries: { type: Object },
              findOneNewsSummaries: { type: Object },
              createNewsSummaries: { type: Object },
              updateNewsSummaries: { type: Object },
              removeNewsSummaries: { type: Object },
            },
          },
        ],
        [
          import('./monitoring/controllers/health.controller'),
          { HealthController: { check: { type: Object } } },
        ],
      ],
    },
  }
}
