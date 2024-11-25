// scripts/bundler/bundler-types.ts
export interface RepomixConfig {
  output: {
    filePath: string
    style: 'markdown' | 'xml' | 'plain'
    removeComments: boolean
    removeEmptyLines: boolean
    showLineNumbers: boolean
    topFilesLength: number
  }
  include: string[]
  ignore: {
    useGitignore: boolean
    useDefaultPatterns: boolean
    customPatterns: string[]
  }
  security: {
    enableSecurityCheck: boolean
    excludePatterns: string[]
  }
}

export interface ConfigCustomization {
  // File and pattern related
  excludePatterns?: string[]
  includePatterns?: string[]
  fileExtensions?: string[]

  // Content related
  removeComments?: boolean
  removeEmptyLines?: boolean

  // Output related
  outputStyle?: 'markdown' | 'xml' | 'plain'
  outputDir?: string

  // Security related
  securityExcludes?: string[]

  // Processing related
  maxFileSize?: number
  maxFiles?: number
  maxDepth?: number

  // Content transformation
  transformers?: Array<(content: string) => string>

  // Hooks
  beforeProcess?: (config: RepomixConfig) => Promise<void> | void
  afterProcess?: (config: RepomixConfig) => Promise<void> | void
}

export interface ConfigGeneratorOptions {
  mode: 'app' | 'search'
  appName?: string
  searchTerm?: string
  rootDir?: string
  componentScan?: ComponentScanResult
  packageScan?: PackageScanResult
  exclude?: string[]
  customization?: ConfigCustomization
}

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

export interface SearchResult {
  files: string[]
  components: string[]
  functions: string[]
  totalMatches: number
  contextSnippets: Array<{
    file: string
    line: number
    content: string
    context: string
  }>
}

export interface ContextConfig {
  name: string
  description: string
  include: string[]
  headerText: string
  config?: {
    removeComments?: boolean
    removeEmptyLines?: boolean
    copyToClipboard?: boolean
    outputStyle?: 'markdown' | 'xml' | 'plain'
    showTokenCount?: boolean
    instructions?: string
    showRepoStructure?: boolean
  }
}

export interface FeatureConfig {
  description: string
  includes: string[]
  excludes: string[]
  relatedFeatures?: string[]
  customization?: ConfigCustomization
}
