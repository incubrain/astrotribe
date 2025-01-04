import type { Page } from 'playwright'
import type { CustomLogger } from '@core'
import {
  extractPublishedDate,
  extractTitle,
  extractAuthor,
  extractFeaturedImage,
  extractKeywords,
} from './index'

export class ExtractorModule {
  constructor(private logger: CustomLogger) {}

  extractPublishedDate(html: string): Date | null {
    try {
      return extractPublishedDate(html)
    } catch (error) {
      this.logger.warn('Failed to extract published date', { error })
      return null
    }
  }

  extractTitle(html: string): string {
    try {
      return extractTitle(html) || ''
    } catch (error) {
      this.logger.warn('Failed to extract title', { error })
      return ''
    }
  }

  extractAuthor(html: string): string | null {
    try {
      return extractAuthor(html)
    } catch (error) {
      this.logger.warn('Failed to extract author', { error })
      return null
    }
  }

  extractFeaturedImage(html: string, baseUrl: string): string | null {
    try {
      return extractFeaturedImage(html, baseUrl)
    } catch (error) {
      this.logger.warn('Failed to extract featured image', { error })
      return null
    }
  }

  extractKeywords(html: string): string[] {
    try {
      return extractKeywords(html)
    } catch (error) {
      this.logger.warn('Failed to extract keywords', { error })
      return []
    }
  }
}
