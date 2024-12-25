import { FeatureExtractor } from './features'
import { FeatureFactory } from './feature.factory'
import * as fs from 'fs'

export class FeaturePipeline {
  private extractors: FeatureExtractor[] = []

  constructor(configFilePath: string) {
    this.loadFeaturesFromConfig(configFilePath)
  }

  private loadFeaturesFromConfig(configFilePath: string): void {
    const configData = fs.readFileSync(configFilePath, 'utf-8')
    const featureConfigs = JSON.parse(configData)

    featureConfigs.forEach((config: any) => {
      const extractor = FeatureFactory.createFeature(config)
      this.extractors.push(extractor)
    })
  }

  extractFeatures(url: string): { [key: string]: number } {
    const features: { [key: string]: number } = {}
    this.extractors.forEach((extractor) => {
      const value = extractor.extract(url)
      features[extractor.featureName] = Number(value) * extractor.weight
    })
    return features
  }

  getFeatureNames(): string[] {
    return this.extractors.map((extractor) => extractor.featureName)
  }
}
