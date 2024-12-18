// templates/module/domain.module.ejs
import { Module } from "@nestjs/common";
import { createDomainModule } from "@core/config/domain-config";
import { ResearchEmbeddingController } from "./controllers/research-embeddings.controller";
import { EmbeddingReviewController } from "./controllers/embedding-reviews.controller";
import { ContentCategoryController } from "./controllers/content-categories.controller";
import { ContentTagController } from "./controllers/content-tags.controller";
import { ContentStatusController } from "./controllers/content-statuses.controller";
import { NewsletterController } from "./controllers/newsletters.controller";
import { ResearchController } from "./controllers/research.controller";
import { CategoryController } from "./controllers/categories.controller";
import { FeedCategoryController } from "./controllers/feed-categories.controller";
import { FeedController } from "./controllers/feeds.controller";
import { ContentSourceController } from "./controllers/content-sources.controller";
import { TagController } from "./controllers/tags.controller";
import { NewsController } from "./controllers/news.controller";
import { NewsTagController } from "./controllers/news-tags.controller";
import { ContentSourceVisitController } from "./controllers/content-source-visits.controller";
import { FeedSourceController } from "./controllers/feed-sources.controller";
import { ContentController } from "./controllers/contents.controller";
import { NewsSummaryController } from "./controllers/news-summaries.controller";
import { ResearchEmbeddingsService } from "./services/research-embeddings.service";
import { EmbeddingReviewsService } from "./services/embedding-reviews.service";
import { ContentCategoriesService } from "./services/content-categories.service";
import { ContentTagsService } from "./services/content-tags.service";
import { ContentStatusesService } from "./services/content-statuses.service";
import { NewslettersService } from "./services/newsletters.service";
import { ResearchService } from "./services/research.service";
import { CategoriesService } from "./services/categories.service";
import { FeedCategoriesService } from "./services/feed-categories.service";
import { FeedsService } from "./services/feeds.service";
import { ContentSourcesService } from "./services/content-sources.service";
import { TagsService } from "./services/tags.service";
import { NewsService } from "./services/news.service";
import { NewsTagsService } from "./services/news-tags.service";
import { ContentSourceVisitService } from "./services/content-source-visits.service";
import { FeedSourceService } from "./services/feed-sources.service";
import { ContentsService } from "./services/contents.service";
import { NewsSummariesService } from "./services/news-summaries.service";

@Module({
  imports: [
    createDomainModule("Content", {
      requiresAuth: true,
      requiresUser: false,
      requiresCompany: false,
    }),

    // AuthModule,
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
    ContentsService,
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
    ContentsService,
    NewsSummariesService,
  ],
})
export class ContentModule {}
