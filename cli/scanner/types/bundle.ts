export interface BundleSummaryMetrics {
  totalSize: number
  chunksCount: number
  averageChunkSize: number
  hydrationSize: number
  duplicatesCount: number
  largestChunkSize: number
  asyncChunksRatio: number
}
