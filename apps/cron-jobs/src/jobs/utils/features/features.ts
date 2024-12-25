export interface FeatureExtractor {
  extract(url: string): number
  featureName: string
  weight: number
}

export class PathLengthFeature implements FeatureExtractor {
  featureName = 'path_length'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    return pathname.length
  }
}

export class NumberOfSlashesFeature implements FeatureExtractor {
  featureName = 'num_slashes'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    return (pathname.match(/\//g) || []).length
  }
}

export class ContainsNumbersFeature implements FeatureExtractor {
  featureName = 'contains_numbers'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    return /\d/.test(pathname) ? 1 : 0
  }
}

export class ContainsKeywordFeature implements FeatureExtractor {
  featureName: string
  weight: number
  private keywords: string[]

  constructor(featureName: string, keywords: string[], weight: number) {
    this.featureName = featureName
    this.keywords = keywords
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname.toLowerCase()
    return this.keywords.some((keyword) => pathname.includes(keyword)) ? 1 : 0
  }
}

export class AverageSegmentLengthFeature implements FeatureExtractor {
  featureName = 'avg_segment_length'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/').filter((segment) => segment.length > 0)
    return segments.length > 0
      ? segments.reduce((sum, segment) => sum + segment.length, 0) / segments.length
      : 0
  }
}

export class EndsWithExtensionFeature implements FeatureExtractor {
  featureName = 'ends_with_extension'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    return /\.\w{2,4}$/.test(pathname) ? 1 : 0
  }
}

export class EndsWithDatePatternFeature implements FeatureExtractor {
  featureName = 'ends_with_date_pattern'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    return /\/\d{4}(\/\d{2})?(\/)?$/.test(pathname) ? 1 : 0
  }
}

export class HyphensInLastSegmentFeature implements FeatureExtractor {
  featureName = 'hyphens_in_last_segment'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/').filter((segment) => segment.length > 0)
    const lastSegment = segments[segments.length - 1] || ''
    return (lastSegment.match(/-/g) || []).length
  }
}

export class LastSegmentLengthFeature implements FeatureExtractor {
  featureName = 'last_segment_length'
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }

  extract(url: string): number {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/').filter((segment) => segment.length > 0)
    const lastSegment = segments[segments.length - 1] || ''
    return lastSegment.length
  }
}
