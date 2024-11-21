// tools/scanners/types.ts
export interface ScanResult {
  timestamp: string
  appName: string
}

export interface PackageScanResult extends ScanResult {
  dependencies: Set<string>
  devDependencies: Set<string>
}

export interface NuxtConfigAnalysis {
  layers: string[]
  modules: string[]
  components?: {
    prefix?: string
    include?: string | string[]
    exclude?: string[]
  }
}

export interface ComponentScanResult extends ScanResult {
  primeComponents: Set<string>
  layerComponents: Set<string>
  layersUsed: Set<string>
  nuxtConfig: NuxtConfigAnalysis
}
