export interface ContentSource {
  id: bigint
  company_id: string
  url: string
  rss_urls: string[]
  hash: bigint
  has_failed: boolean
  failed_count: number
  refreshed_at: Date
  expected_count?: number
}
