export interface Plugin {
  name: string
  beforeProcess?: (options: ExtractorOptions) => Promise<void> | void
  shouldProcessFile?: (filePath: string, options: ExtractorOptions) => Promise<boolean> | boolean
  processFileContent?: (
    filePath: string,
    content: string,
    options: ExtractorOptions,
  ) => Promise<string> | string
  afterProcess?: (stats: ProcessStats, options: ExtractorOptions) => Promise<void> | void
}

export interface FileStats {
  path: string
  originalPath: string
  size: number
  tokens: number
  content: string // Store the processed content
}

export interface ProcessStats {
  totalFiles: number
  processedFiles: number
  skippedFiles: number
  totalTokens: number
  fileStats: Map<string, FileStats>
}

export interface ExtractorOptions {
  packageName: string
  outputPath: string
  exclude: string[]
  plugins: Plugin[]
  debug: boolean
}
