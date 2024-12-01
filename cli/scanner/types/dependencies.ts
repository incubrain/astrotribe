export interface BundleMetrics {
  totalSize: number
  chunks: ChunkInfo[]
  suggestions: Suggestion[]
  hydrationSize: number
  duplicates: DuplicateDependency[]
}

export interface ChunkInfo {
  name: string
  size: number
  modules: ModuleInfo[]
}

export interface ModuleInfo {
  name: string
  size: number
  isAsync: boolean
}

export interface Suggestion {
  type: 'code-splitting' | 'duplicate' | 'size' | 'hydration'
  message: string
  impact: 'high' | 'medium' | 'low'
  file?: string
}

export interface DuplicateDependency {
  name: string
  versions: string[]
  locations: string[]
}

export interface DependencySummaryMetrics {
  totalUnused: number
  unusedDependencies: number
  unusedDevDependencies: number
  unusedPercentage: number
  highImpactDependencies: string[]
  totalDependencies: number
}
