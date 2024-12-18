// templates/entity/model.ejs
import { BaseModel } from "@/core/base/base.model";
import { scrape_frequency, content_status } from "@prisma/client";

// import { CompaniesModel } from "@org/models/companies.model";
// import { SocialMediaModel } from "@org/models/social-media.model";


import { ContentSourcesModel } from "@content/models/content-sources.model";

import { CategoriesModel } from "@content/models/categories.model";

import { ContentsModel } from "@content/models/contents.model";

// Model interface
export interface NewsModel extends BaseModel {
  created_at: Date;

  updated_at: Date;
  title?: string;
  body?: string;
  category_id?: string;
  author?: string;
  description?: string;
  featured_image?: string;
  has_summary: boolean;
  published_at?: Date;
  url: string;
  hash?: string;
  id: string;
  company_id?: string;
  failed_count?: number;
  scrape_frequency: scrape_frequency;
  scraped_at?: Date;
  content_status: content_status;
  keywords?: Record<string, any>;
  score?: number;
  content_source_id?: string;
  content_sources?: ContentSourcesModel;
  news: NewsModel[];
  categories?: CategoriesModel[];
  contents: ContentsModel;
  // companies?: CompaniesModel[];
  // social_media?: SocialMediaModel[];
}
