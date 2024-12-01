// plugins/duplication/parser.ts
import * as fs from 'fs/promises'
import * as path from 'path'
import { createHash } from 'crypto'
import type {
  ScannerPlugin,
  ScanContext,
  ScanResult,
  PluginReportConfig,
  DuplicationResult,
  DuplicationSummaryMetrics,
} from '../types'

interface CodeBlock {
  content: string
  startLine: number
  endLine: number
  hash: string
}

interface FileBlocks {
  filePath: string
  blocks: CodeBlock[]
}

export interface DuplicationMatch {
  fileA: string
  fileB: string
  startLineA: number
  endLineA: number
  startLineB: number
  endLineB: number
  duplicateLines: number
  content: string
}

export class DuplicationParser {
  private minLines: number
  private minTokens: number

  constructor(options: { minLines?: number; minTokens?: number } = {}) {
    this.minLines = options.minLines || 5
    this.minTokens = options.minTokens || 50
  }

  private async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error)
      return ''
    }
  }

  private async getFilesToScan(dir: string, exclude: string[] = []): Promise<string[]> {
    const files: string[] = []

    async function scan(directory: string) {
      const entries = await fs.readdir(directory, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name)

        // Check exclusions
        if (exclude.some((pattern) => fullPath.includes(pattern))) {
          continue
        }

        if (entry.isDirectory()) {
          await scan(fullPath)
        } else if (entry.isFile() && /\.(ts|tsx|vue|js|jsx)$/.test(entry.name)) {
          files.push(fullPath)
        }
      }
    }

    await scan(dir)
    return files
  }

  private getCodeBlocks(content: string, filePath: string): CodeBlock[] {
    const lines = content.split('\n')
    const blocks: CodeBlock[] = []

    for (let i = 0; i < lines.length - this.minLines + 1; i++) {
      for (let j = i + this.minLines; j <= Math.min(i + 50, lines.length); j++) {
        const block = lines.slice(i, j).join('\n')

        // Skip if block is too small
        if (block.length < this.minTokens) continue

        // Create normalized version for comparison
        const normalized = this.normalizeCode(block)

        blocks.push({
          content: block,
          startLine: i + 1,
          endLine: j,
          hash: this.hashContent(normalized),
        })
      }
    }

    return blocks
  }

  private normalizeCode(code: string): string {
    return code
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/['"`][^'"`]*['"`]/g, '""') // Normalize strings
      .replace(/\d+/g, '0') // Normalize numbers
      .toLowerCase() // Case insensitive
      .trim()
  }

  private hashContent(content: string): string {
    return createHash('sha1').update(content).digest('hex')
  }

  async findDuplications(
    projectPath: string,
    excludePaths: string[] = [],
  ): Promise<DuplicationMatch[]> {
    // Get all files to scan
    const files = await this.getFilesToScan(projectPath, excludePaths)

    // Parse all files and get their blocks
    const fileBlocks: FileBlocks[] = await Promise.all(
      files.map(async (filePath) => ({
        filePath,
        blocks: this.getCodeBlocks(await this.readFile(filePath), filePath),
      })),
    )

    // Find duplicates
    const duplicates: DuplicationMatch[] = []
    const seenHashes = new Map<string, { file: string; block: CodeBlock }[]>()

    for (const { filePath, blocks } of fileBlocks) {
      for (const block of blocks) {
        const existing = seenHashes.get(block.hash) || []

        // Check for duplicates
        for (const match of existing) {
          // Skip if same file
          if (match.file === filePath) continue

          duplicates.push({
            fileA: match.file,
            fileB: filePath,
            startLineA: match.block.startLine,
            endLineA: match.block.endLine,
            startLineB: block.startLine,
            endLineB: block.endLine,
            duplicateLines: block.endLine - block.startLine + 1,
            content: block.content,
          })
        }

        // Add to seen hashes
        seenHashes.set(block.hash, [...existing, { file: filePath, block }])
      }
    }

    return this.filterDuplicates(duplicates)
  }

  private filterDuplicates(duplicates: DuplicationMatch[]): DuplicationMatch[] {
    // Remove overlapping duplicates, keeping the largest ones
    return duplicates
      .sort((a, b) => b.duplicateLines - a.duplicateLines)
      .filter((dup, index, arr) => {
        return !arr.slice(0, index).some((other) => this.isOverlapping(dup, other))
      })
  }

  private isOverlapping(a: DuplicationMatch, b: DuplicationMatch): boolean {
    if (a.fileA !== b.fileA && a.fileA !== b.fileB) return false
    if (a.fileB !== b.fileA && a.fileB !== b.fileB) return false

    const rangeA = { start: a.startLineA, end: a.endLineA }
    const rangeB = { start: a.startLineB, end: a.endLineB }
    const rangeC = { start: b.startLineA, end: b.endLineA }
    const rangeD = { start: b.startLineB, end: b.endLineB }

    return (
      this.rangesOverlap(rangeA, rangeC) ||
      this.rangesOverlap(rangeA, rangeD) ||
      this.rangesOverlap(rangeB, rangeC) ||
      this.rangesOverlap(rangeB, rangeD)
    )
  }

  private rangesOverlap(
    a: { start: number; end: number },
    b: { start: number; end: number },
  ): boolean {
    return a.start <= b.end && b.start <= a.end
  }
}

export class DuplicationScanner implements ScannerPlugin {
  name = 'duplication'

  async run(context: ScanContext): Promise<ScanResult> {
    try {
      const parser = new DuplicationParser({
        minLines: 5, // Minimum lines for a duplicate block
        minTokens: 50, // Minimum characters for a duplicate block
      })

      const duplicates = await parser.findDuplications(
        context.projectPath,
        context.globalConfig.excludePaths,
      )

      return {
        pluginName: this.name,
        success: true,
        data: duplicates,
      }
    } catch (error) {
      return {
        pluginName: this.name,
        success: false,
        data: [],
        errors: [(error as Error).message],
      }
    }
  }
}

export const duplicationConfig: PluginReportConfig = {
  name: 'duplication',
  weight: 0.25,
  thresholds: {
    critical: 65, // Score below this indicates dangerous levels of duplication
    warning: 85, // Score below this suggests need for refactoring
  },
  scoring: (data: unknown) => {
    const results = data as DuplicationResult[]
    if (!results?.length) return 100

    let score = 100
    const totalDuplicateLines = results.reduce((sum, r) => sum + r.duplicateLines, 0)

    // Impact based on number of duplications (40% weight)
    const duplicateCount = results.length
    if (duplicateCount > 20) score -= 40
    else score -= (duplicateCount / 20) * 40

    // Impact based on size of duplications (40% weight)
    const avgDuplicateSize = totalDuplicateLines / results.length
    if (avgDuplicateSize > 50) score -= 40
    else score -= (avgDuplicateSize / 50) * 40

    // Impact based on file spread (20% weight)
    const uniqueFiles = new Set(results.flatMap((r) => [r.fileA, r.fileB]))
    const fileSpread = uniqueFiles.size
    if (fileSpread > 10) score -= 20
    else score -= (fileSpread / 10) * 20

    return Math.max(0, Math.round(score))
  },
  summarize: (data: unknown) => {
    const results = data as DuplicationResult[]
    const issues = [] as Array<{ type: string; severity: 'critical' | 'warning'; message: string }>

    // Calculate metrics
    const totalDuplicateLines = results.reduce((sum, r) => sum + r.duplicateLines, 0)
    const averageDuplicateSize = totalDuplicateLines / results.length
    const largestDuplicate = Math.max(...results.map((r) => r.duplicateLines))

    // Track duplication by file
    const duplicationByFile: Record<string, number> = {}
    results.forEach((result) => {
      duplicationByFile[result.fileA] =
        (duplicationByFile[result.fileA] || 0) + result.duplicateLines
      duplicationByFile[result.fileB] =
        (duplicationByFile[result.fileB] || 0) + result.duplicateLines
    })

    const affectedFiles = Array.from(new Set(results.flatMap((r) => [r.fileA, r.fileB])))

    const summary: DuplicationSummaryMetrics = {
      totalDuplicates: results.length,
      totalDuplicateLines,
      averageDuplicateSize,
      largestDuplicate,
      affectedFiles,
      duplicationByFile,
      duplicationPercentage: 0, // Would need total LOC to calculate
    }

    // Generate issues based on findings
    if (largestDuplicate > 50) {
      issues.push({
        type: 'large-duplication',
        severity: 'critical',
        message: `Large code duplication found (${largestDuplicate} lines)`,
      })
    }

    if (averageDuplicateSize > 20) {
      issues.push({
        type: 'average-duplication',
        severity: 'warning',
        message: `High average duplication size (${averageDuplicateSize.toFixed(1)} lines)`,
      })
    }

    const hotspots = Object.entries(duplicationByFile)
      .filter(([, lines]) => lines > 100)
      .map(([file]) => file)

    if (hotspots.length > 0) {
      issues.push({
        type: 'duplication-hotspot',
        severity: 'critical',
        message: `Duplication hotspots found in: ${hotspots.join(', ')}`,
      })
    }

    return {
      score: duplicationConfig.scoring(data),
      issues,
      metrics: summary,
    }
  },
}
