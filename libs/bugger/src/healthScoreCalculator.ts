import type { PageResult } from './types'
import { PerformanceMetrics } from './types'

/**
 * Health score calculator for evaluating page health
 */
export class HealthScoreCalculator {
  // Weights for different components of the health score
  private static readonly ERROR_WEIGHT = 0.4
  private static readonly WARNING_WEIGHT = 0.2
  private static readonly PERFORMANCE_WEIGHT = 0.25
  private static readonly RESOURCE_WEIGHT = 0.15

  /**
   * Calculate health score for a page
   */
  public calculateHealthScore(pageResult: PageResult): number {
    // Calculate component scores
    const errorScore = this.calculateErrorScore(pageResult)
    const warningScore = this.calculateWarningScore(pageResult)
    const performanceScore = this.calculatePerformanceScore(pageResult)
    const resourceScore = this.calculateResourceScore(pageResult)

    // Calculate weighted average
    const healthScore =
      errorScore * HealthScoreCalculator.ERROR_WEIGHT +
      warningScore * HealthScoreCalculator.WARNING_WEIGHT +
      performanceScore * HealthScoreCalculator.PERFORMANCE_WEIGHT +
      resourceScore * HealthScoreCalculator.RESOURCE_WEIGHT

    // Store breakdown for reference
    pageResult.healthScoreBreakdown = {
      errors: errorScore,
      warnings: warningScore,
      performance: performanceScore,
      resources: resourceScore,
    }

    // Set the health score
    pageResult.healthScore = Math.round(healthScore * 100)

    return pageResult.healthScore
  }

  /**
   * Calculate error score (0-1, higher is better)
   */
  private calculateErrorScore(pageResult: PageResult): number {
    const errorCount = pageResult.logs.filter(
      (log) => log.type === 'error' || log.severity === 'error',
    ).length

    // Exponential decay: score decreases exponentially with error count
    // 0 errors = 1.0, 1 error = 0.8, 2 errors = 0.6, etc.
    return Math.max(0, 1 - errorCount * 0.2)
  }

  /**
   * Calculate warning score (0-1, higher is better)
   */
  private calculateWarningScore(pageResult: PageResult): number {
    const warningCount = pageResult.logs.filter(
      (log) => log.type === 'warning' || log.severity === 'warning',
    ).length

    // Linear decay: score decreases linearly with warning count
    // 0 warnings = 1.0, 5 warnings = 0.5, 10+ warnings = 0
    return Math.max(0, 1 - warningCount * 0.1)
  }

  /**
   * Calculate performance score (0-1, higher is better)
   */
  private calculatePerformanceScore(pageResult: PageResult): number {
    if (!pageResult.performanceMetrics) {
      return 0.5 // Default score if no metrics available
    }

    const metrics = pageResult.performanceMetrics
    let score = 0
    let count = 0

    // First Contentful Paint (FCP) - lower is better
    if (metrics.firstContentfulPaint) {
      // Good: < 1.8s, Needs Improvement: 1.8-3s, Poor: > 3s
      if (metrics.firstContentfulPaint < 1800) {
        score += 1
      } else if (metrics.firstContentfulPaint < 3000) {
        score += 0.5
      }
      count++
    }

    // Largest Contentful Paint (LCP) - lower is better
    if (metrics.largestContentfulPaint) {
      // Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
      if (metrics.largestContentfulPaint < 2500) {
        score += 1
      } else if (metrics.largestContentfulPaint < 4000) {
        score += 0.5
      }
      count++
    }

    // First Input Delay (FID) - lower is better
    if (metrics.firstInputDelay) {
      // Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
      if (metrics.firstInputDelay < 100) {
        score += 1
      } else if (metrics.firstInputDelay < 300) {
        score += 0.5
      }
      count++
    }

    // Cumulative Layout Shift (CLS) - lower is better
    if (metrics.cumulativeLayoutShift) {
      // Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
      if (metrics.cumulativeLayoutShift < 0.1) {
        score += 1
      } else if (metrics.cumulativeLayoutShift < 0.25) {
        score += 0.5
      }
      count++
    }

    // Total Blocking Time (TBT) - lower is better
    if (metrics.totalBlockingTime) {
      // Good: < 200ms, Needs Improvement: 200-600ms, Poor: > 600ms
      if (metrics.totalBlockingTime < 200) {
        score += 1
      } else if (metrics.totalBlockingTime < 600) {
        score += 0.5
      }
      count++
    }

    // Speed Index (SI) - lower is better
    if (metrics.speedIndex) {
      // Good: < 3.4s, Needs Improvement: 3.4-5.8s, Poor: > 5.8s
      if (metrics.speedIndex < 3.4) {
        score += 1
      } else if (metrics.speedIndex < 5.8) {
        score += 0.5
      }
      count++
    }

    // Time to First Byte (TTFB) - lower is better
    if (metrics.timeToFirstByte) {
      // Good: < 0.6s, Needs Improvement: 0.6-1s, Poor: > 1s
      if (metrics.timeToFirstByte < 600) {
        score += 1
      } else if (metrics.timeToFirstByte < 1000) {
        score += 0.5
      }
      count++
    }

    // Return average score or default if no metrics available
    return count > 0 ? score / count : 0.5
  }

  /**
   * Calculate resource score (0-1, higher is better)
   */
  private calculateResourceScore(pageResult: PageResult): number {
    const failedRequestCount = pageResult.failedRequests.length

    // Linear decay: score decreases linearly with failed request count
    // 0 failed requests = 1.0, 5 failed requests = 0.5, 10+ failed requests = 0
    return Math.max(0, 1 - failedRequestCount * 0.1)
  }

  /**
   * Get health status based on score
   */
  public static getHealthStatus(score: number): 'Good' | 'Warning' | 'Poor' {
    if (score >= 80) {
      return 'Good'
    } else if (score >= 50) {
      return 'Warning'
    } else {
      return 'Poor'
    }
  }
}
