// templates/module/content.module.ejs
import { Module } from '@nestjs/common'
import { CoreModule } from '@core/core.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { PermissionModule } from '@core/modules/permission.module'
import { createDomainModule } from '@core/config/domain-config'
// Controllers
import { ResearchEmbeddingController } from '@content/controllers/research-embeddings.controller'
import { EmbeddingReviewController } from '@content/controllers/embedding-reviews.controller'
import { ContentCategoryController } from '@content/controllers/content-categories.controller'
import { ContentTagController } from '@content/controllers/content-tags.controller'
import { ContentStatusController } from '@content/controllers/content-statuses.controller'
import { NewsletterController } from '@content/controllers/newsletters.controller'
import { ResearchController } from '@content/controllers/research.controller'
import { CategoryController } from '@content/controllers/categories.controller'
import { FeedCategoryController } from '@content/controllers/feed-categories.controller'
import { FeedController } from '@content/controllers/feeds.controller'
import { ContentSourceController } from '@content/controllers/content-sources.controller'
import { TagController } from '@content/controllers/tags.controller'
import { NewsController } from '@content/controllers/news.controller'
import { NewsTagController } from '@content/controllers/news-tags.controller'
import { ContentSourceVisitController } from '@content/controllers/content-source-visits.controller'
import { FeedSourceController } from '@content/controllers/feed-sources.controller'
import { ContentController } from '@content/controllers/content.controller'
import { NewsSummaryController } from '@content/controllers/news-summaries.controller'

// Services
import { ResearchEmbeddingsService } from '@content/services/research-embeddings.service'
import { EmbeddingReviewsService } from '@content/services/embedding-reviews.service'
import { ContentCategoriesService } from '@content/services/content-categories.service'
import { ContentTagsService } from '@content/services/content-tags.service'
import { ContentStatusesService } from '@content/services/content-statuses.service'
import { NewslettersService } from '@content/services/newsletters.service'
import { ResearchService } from '@content/services/research.service'
import { CategoriesService } from '@content/services/categories.service'
import { FeedCategoriesService } from '@content/services/feed-categories.service'
import { FeedsService } from '@content/services/feeds.service'
import { ContentSourcesService } from '@content/services/content-sources.service'
import { TagsService } from '@content/services/tags.service'
import { NewsService } from '@content/services/news.service'
import { NewsTagsService } from '@content/services/news-tags.service'
import { ContentSourceVisitService } from '@content/services/content-source-visits.service'
import { FeedSourceService } from '@content/services/feed-sources.service'
import { ContentService } from '@content/services/content.service'
import { NewsSummariesService } from '@content/services/news-summaries.service'

@Module({
  imports: [
    PrismaModule,
    PermissionModule,
    CoreModule,
    createDomainModule('content', {
      requiresAuth: true,
      requiresCompany: false,
    }),
  ],
  controllers: [
    ResearchEmbeddingController,
    EmbeddingReviewController,
    ContentCategoryController,
    ContentTagController,
    ContentStatusController,
    NewsletterController,
    ResearchController,
    CategoryController,
    FeedCategoryController,
    FeedController,
    ContentSourceController,
    TagController,
    NewsController,
    NewsTagController,
    ContentSourceVisitController,
    FeedSourceController,
    ContentController,
    NewsSummaryController,
  ],
  providers: [
    EmbeddingReviewsService,
    ResearchEmbeddingsService,
    ContentCategoriesService,
    ContentTagsService,
    ContentStatusesService,
    NewslettersService,
    ResearchService,
    CategoriesService,
    FeedCategoriesService,
    FeedsService,
    ContentSourcesService,
    TagsService,
    NewsService,
    NewsTagsService,
    ContentSourceVisitService,
    FeedSourceService,
    ContentService,
    NewsSummariesService,
  ],
  exports: [
    ResearchEmbeddingsService,
    EmbeddingReviewsService,
    ContentCategoriesService,
    ContentTagsService,
    ContentStatusesService,
    NewslettersService,
    ResearchService,
    CategoriesService,
    FeedCategoriesService,
    FeedsService,
    ContentSourcesService,
    TagsService,
    NewsService,
    NewsTagsService,
    ContentSourceVisitService,
    FeedSourceService,
    ContentService,
    NewsSummariesService,
  ],
})
export class ContentModule {}
