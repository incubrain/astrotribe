// clients/database.client.ts
import Pool from 'pg-pool';
import { defu } from 'defu';
import {
  DatabaseClient,
  DatabaseConfig,
  MergedConfig,
  NewsArticle,
} from '../types';

export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  pool: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  ssl: process.env.NODE_ENV === 'production',
};

export class DatabaseClientImpl implements DatabaseClient {
  private pool: Pool;
  private config: MergedConfig<DatabaseConfig, typeof DEFAULT_DB_CONFIG>;

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = defu(config, DEFAULT_DB_CONFIG);

    if (!this.config.connectionString && !process.env.DATABASE_URL) {
      throw new Error('Database connection string is required');
    }

    this.pool = new Pool(
      defu(
        {
          connectionString:
            this.config.connectionString || process.env.DATABASE_URL,
        },
        this.config.pool,
        { ssl: this.config.ssl }
      )
    );
  }

  async getArticlesWithoutSummary(limit: number): Promise<NewsArticle[]> {
    const query = `
      SELECT 
        id, title, body, author, url, description, 
        featured_image, published_at, keywords, 
        content_status, category_id, created_at, updated_at
      FROM news
      WHERE has_summary = false 
        AND content_status = 'published'
        AND body IS NOT NULL
      ORDER BY published_at DESC NULLS LAST
      LIMIT $1
    `;

    try {
      const result = await this.pool.query(query, [limit]);
      return result.rows.map((row) => ({
        ...row,
        published_at: row.published_at ? new Date(row.published_at) : null,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Database error in getArticlesWithoutSummary:', error);
      throw new Error('Failed to fetch articles without summary');
    }
  }

  async insertSummary(newsId: string, summary: string): Promise<void> {
    const query = `
      INSERT INTO news_summaries (news_id, summary)
      VALUES ($1, $2)
      ON CONFLICT (news_id) 
      DO UPDATE SET 
        summary = $2
    `;

    try {
      await this.pool.query(query, [newsId, summary]);
    } catch (error) {
      console.error('Database error in insertSummary:', error);
      throw new Error('Failed to insert summary');
    }
  }

  async markArticleHasSummary(newsId: string): Promise<void> {
    const query = `
      UPDATE news
      SET 
        has_summary = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    try {
      await this.pool.query(query, [newsId]);
    } catch (error) {
      console.error('Database error in markArticleHasSummary:', error);
      throw new Error('Failed to mark article as summarized');
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
