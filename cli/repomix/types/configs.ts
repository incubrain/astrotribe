import type { ComponentScanResult, PackageScanResult } from './scanners'

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

export interface OutputConfig {
  directory: string
  filename: string
  extension?: 'txt' | 'md'
}

export interface FeatureConfig {
  id: string
  name: string
  description: string
  include: string[]
  ignore: {
    useGitignore: boolean
    useDefaultPatterns: boolean
    customPatterns: string[]
  }
  relatedFeatures?: string[]
  tags?: string[]
  maintainers?: string[]
  dependencies?: string[]
  outputConfig?: OutputConfig
}

export interface CommonConfig {
  include: string[]
  ignore?: { customPatterns: string[] }
  description?: string
}

export interface PatternGroup {
  patterns: string[]
  description?: string
}

export type PatternType = 'include' | 'excludes'
