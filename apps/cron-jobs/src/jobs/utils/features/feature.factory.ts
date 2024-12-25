import * as feat from './features'

export class FeatureFactory {
  static createFeature(config: any): feat.FeatureExtractor {
    switch (config.type) {
      case 'PathLengthFeature':
        return new feat.PathLengthFeature(config.weight)
      case 'NumberOfSlashesFeature':
        return new feat.NumberOfSlashesFeature(config.weight)
      case 'ContainsNumbersFeature':
        return new feat.ContainsNumbersFeature(config.weight)
      case 'ContainsKeywordFeature':
        return new feat.ContainsKeywordFeature(config.featureName, config.keywords, config.weight)
      case 'AverageSegmentLengthFeature':
        return new feat.AverageSegmentLengthFeature(config.weight)
      case 'EndsWithExtensionFeature':
        return new feat.EndsWithExtensionFeature(config.weight)
      case 'EndsWithDatePatternFeature':
        return new feat.EndsWithDatePatternFeature(config.weight)
      case 'HyphensInLastSegmentFeature':
        return new feat.HyphensInLastSegmentFeature(config.weight)
      case 'LastSegmentLengthFeature':
        return new feat.LastSegmentLengthFeature(config.weight)
      default:
        throw new Error(`Unknown feature type: ${config.type}`)
    }
  }
}
