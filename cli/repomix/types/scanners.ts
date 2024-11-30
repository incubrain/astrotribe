// cli/types/scanner-types.ts

export interface ComponentScanResult {
  timestamp: string
  appName: string
  primeComponents: Set<string>
  layerComponents: Set<string>
  layersUsed: Set<string>
  customComponents: Set<string>
  fileMatches: Set<string>
  nuxtConfig: NuxtConfigAnalysis | null
  isNuxtApp: boolean
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

export interface PackageScanResult {
  timestamp: string
  appName: string
  dependencies: Set<string>
  devDependencies: Set<string>
}

export interface ScannerOptions {
  debug?: boolean
  cwd?: string
  searchTerm?: string
  currentFile?: string
}

export interface BaseScanner {
  scan(path: string, options?: ScannerOptions): Promise<any>
}
