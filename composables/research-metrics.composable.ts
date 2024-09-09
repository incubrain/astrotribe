interface CostAndStorageParams {
  dataLength: number
  chunkLength: number
  abstractLength: number
  chunkCount: number
}

function calculateAverageCitationDensity(totalCitations: number, totalChunks: number): number {
  return totalCitations / totalChunks
}

function calculateFigureInclusionRate(chunks: any[], totalChunks: number): number {
  const chunksWithFigures = chunks.filter((chunk) => chunk.includesFigures)
  return (chunksWithFigures.length / totalChunks) * 100
}

function calculateMathExpressionDensity(totalMathExpressions: number, totalChunks: number): number {
  return totalMathExpressions / totalChunks
}

function calculateAverageProcessingTime(performance: any, totalChunks: number): number {
  return performance.processingTime / totalChunks
}

function calculateMemoryUsagePerChunk(performance: any, totalChunks: number): number {
  return (performance.memoryUsageEnd - performance.memoryUsageStart) / totalChunks
}

function calculatePeakMemoryUsage(memoryUsageOverTime: number[]): number {
  return Math.max(...memoryUsageOverTime)
}

function calculateMemoryEfficiency(performance: any, totalChunks: number): number {
  return performance.memoryUsageDiff / totalChunks
}

function calculateTimeEfficiency(performance: any, totalChunks: number): number {
  return performance.total_duration / totalChunks
}

function calculateResourceUsageIndex(memoryEfficiency: number, timeEfficiency: number): number {
  return (memoryEfficiency + timeEfficiency) / 2
}

export function useResearchMetrics() {
  const { calculate, format } = useBaseMetrics()

  function calculateChunkSizeVariability(chunkLengths: number[]): number {
    return calculate.standardDeviation(chunkLengths)
  }

  function calculateCostAndStorage({
    dataLength,
    abstractLength,
    chunkLength,
    chunkCount,
  }: CostAndStorageParams): any {
    // OPEN AI COSTS:
    // GPT4o INPUT: US$5.00 / 1M tokens
    // GPT4o OUTPUT: US$15.00 / 1M tokens
    // EMBEDDINGS SMALL: US$0.02 / 1M tokens

    const embedCostPerToken = 0.02 / 1000000 // $0.02 per million tokens
    const gptInputCostPerToken = 5 / 1000000 // $5 per million tokens
    const gptOutputCostPerToken = 15 / 1000000 // $15 per million tokens

    const chunkTokens = Math.ceil(chunkLength / 4)
    const dataTokens = Math.ceil(dataLength / 4)
    const abstractTokens = Math.ceil(abstractLength / 4)

    const chunkEmbedCost = format.roundToN(chunkTokens * embedCostPerToken, 6)
    const dataEmbedCost = format.roundToN(dataTokens * embedCostPerToken, 6)
    const abstractEmbedCost = format.roundToN(abstractTokens * embedCostPerToken, 6)

    const abstractSumInputCost = format.roundToN(abstractTokens * gptInputCostPerToken, 6)
    const abstractSumOutputCost = format.roundToN(abstractTokens * gptOutputCostPerToken, 6)

    const embeddingRowSize = chunkLength + chunkCount * 1536 * 4 // Approximate size in bytes (1536 dimensions (text-embedding-3-small) * 4 bytes per float for embeddings)
    const dataRowSize = dataLength * 4
    const abstractRowSize = abstractLength * 4

    return {
      chunkEmbedCost,
      dataEmbedCost,
      abstractEmbedCost,
      abstractSumInputCost,
      abstractSumOutputCost,
      embeddingRowSize,
      dataRowSize,
      abstractRowSize,
    }
  }

  return {
    cost: {
      calculateCostAndStorage,
    },
    chunks: {
      calculateChunkSizeVariability,
    },
    density: {
      calculateAverageCitationDensity,
      calculateFigureInclusionRate,
      calculateMathExpressionDensity,
    },
    performance: {
      calculateAverageProcessingTime,
      calculateMemoryUsagePerChunk,
      calculatePeakMemoryUsage,
      calculateMemoryEfficiency,
      calculateTimeEfficiency,
      calculateResourceUsageIndex,
    },
  }
}
