export interface DuplicationResult {
  fileA: string
  fileB: string
  startLineA: number
  endLineA: number
  startLineB: number
  endLineB: number
  duplicateLines: number
}

export interface DuplicationSummaryMetrics {
  totalDuplicates: number
  totalDuplicateLines: number
  averageDuplicateSize: number
  largestDuplicate: number
  affectedFiles: string[]
  duplicationByFile: Record<string, number>
  duplicationPercentage: number // If we have total LOC
}
