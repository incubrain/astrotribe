// templates/entity/model.ejs
import { BaseModel } from "@/core/base/base.model";
import { ContentSourcesModel } from "@content/models/content-sources.model";
import { NewsModel } from "@content/models/news.model";
import { CategoriesModel } from "@content/models/categories.model";
import { ContentsModel } from "@content/models/contents.model";


// import { CompaniesModel } from "@org/models/companies.model";

// Model interface
export interface NewsSummariesModel extends BaseModel {
  id: string;

  news_id: string;

  summary?: string;

  embedding?: string;

  complexity_level?: string;

  version: number;

  is_current?: boolean;

  created_at?: Date;

  updated_at?: Date;

  content_sources: ContentSourcesModel[];

  news: NewsModel;

  categories: CategoriesModel[];

  // companies: CompaniesModel[];

  contents: ContentsModel[];
}
