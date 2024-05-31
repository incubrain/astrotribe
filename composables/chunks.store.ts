interface BaseNotification {
  summary: string
  message: string
}

export const useChunksStore = defineStore('chunksStore', () => {
  const logger = useLogger('chunksStore')
  const toast = useNotification()
  const client = useSupabaseClient()

  const chunks = ref<any[]>([])

  async function flagChunk(chunkId: number, is_flagged: boolean) {
    console.log('flagChunk:', chunkId, is_flagged)
    try {
      const { data, error } = await client
        .from('research_embeddings')
        .update({ is_flagged: !is_flagged })
        .eq('id', chunkId)
        .select()

      console.log('flagChunk: res', data, error)
      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        return
      }

      const updatedChunk = data[0]

      if (updatedChunk.is_flagged) {
        flaggedChunks.value.push(updatedChunk)
        chunks.value = chunks.filter((chunk: any) => chunk.id !== updatedChunk.id)
      } else {
        flaggedChunks.value = flaggedChunks.value.filter(
          (chunk: any) => chunk.id !== updatedChunk.id
        )
        chunks.value.push(updatedChunk)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const flaggedChunks = ref<any[]>([])
  async function fetchChunks(isFlagged: boolean = false, maxChunks: number = 100) {
    try {
      let query = client
        .from('research_embeddings')
        .select('id, research_id, chunk, url, is_flagged')
        .eq('is_flagged', isFlagged)
        .range(0, 100)

      if (isFlagged) {
        query = query.order('updated_at', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }
      if (isFlagged) {
        flaggedChunks.value.push(...data)
      } else {
        chunks.value.push(...data)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const similarChunks = ref<any[]>([])
  async function fetchSimilarDocuments({ search, matchThreshold = 0.41, matchCount = 25 }) {
    try {
      const response = await client.functions.invoke('openai', {
        method: 'POST',
        body: { query: searchInput.value, match_threshold: matchThreshold, match_count: matchCount }
      })

      if (!response.data) {
        return
      }

      console.log('response:', response)
      chunks.value.push(...response.data)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async function deleteChunk(chunkId: number) {
    console.log('deleteChunk:', chunkId)
    try {
      const { error } = await client.from('research_embeddings').delete().eq('id', chunkId)

      console.log('deleteChunk: res', error)
      if (error) {
        throw new Error(error.message)
      }

      flaggedChunks.value = flaggedChunks.value.filter((chunk: any) => chunk.id !== chunkId)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  function cleanText(text) {
    // Regular expression to match the pattern [chars(num/char/|)]
    return text.replace(/\[.*?\(\d+[^\)]*\)\]/g, '')
  }

  function calculateMedian(arr) {
    const sorted = arr.slice().sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }

  function calculateStandardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length
    return Math.sqrt(arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length)
  }

  function calculateMetrics(chunks) {
    console.log('calculateMetrics:', chunks)
    const metrics = {
      totalLengthBefore: 0,
      totalLengthAfter: 0,
      totalItemsCleaned: 0,
      longestLengthBefore: 0,
      longestLengthAfter: 0,
      shortestLengthBefore: Infinity,
      shortestLengthAfter: Infinity,
      lengthsBefore: [],
      lengthsAfter: []
    }

    chunks.forEach((embed) => {
      const lengthBefore = embed.chunk.length
      const cleanedText = cleanText(embed.chunk)
      const lengthAfter = cleanedText.length
      const itemsCleaned = embed.chunk.match(/\[.*?\(\d+[^\)]*\)\]/g)?.length || 0

      metrics.totalLengthBefore += lengthBefore
      metrics.totalLengthAfter += lengthAfter
      metrics.totalItemsCleaned += itemsCleaned

      if (lengthBefore > metrics.longestLengthBefore) {
        metrics.longestLengthBefore = lengthBefore
      }
      if (lengthAfter > metrics.longestLengthAfter) {
        metrics.longestLengthAfter = lengthAfter
      }
      if (lengthBefore < metrics.shortestLengthBefore) {
        metrics.shortestLengthBefore = lengthBefore
      }
      if (lengthAfter < metrics.shortestLengthAfter) {
        metrics.shortestLengthAfter = lengthAfter
      }

      metrics.lengthsBefore.push(lengthBefore)
      metrics.lengthsAfter.push(lengthAfter)
    })

    const averageLengthBefore = metrics.totalLengthBefore / chunks.length
    const averageLengthAfter = metrics.totalLengthAfter / chunks.length
    const averageDifference = (metrics.totalLengthBefore - metrics.totalLengthAfter) / chunks.length
    const averageItemsCleaned = metrics.totalItemsCleaned / chunks.length

    const medianLengthBefore = calculateMedian(metrics.lengthsBefore)
    const medianLengthAfter = calculateMedian(metrics.lengthsAfter)

    const standardDeviationBefore = calculateStandardDeviation(metrics.lengthsBefore)
    const standardDeviationAfter = calculateStandardDeviation(metrics.lengthsAfter)

    return {
      averageLengthBefore,
      averageLengthAfter,
      averageDifference,
      averageItemsCleaned,
      longestLengthBefore: metrics.longestLengthBefore,
      longestLengthAfter: metrics.longestLengthAfter,
      shortestLengthBefore: metrics.shortestLengthBefore,
      shortestLengthAfter: metrics.shortestLengthAfter,
      medianLengthBefore,
      medianLengthAfter,
      standardDeviationBefore,
      standardDeviationAfter
    }
  }

  return {
    flagChunk,
    fetchChunks,
    fetchSimilarDocuments,
    deleteChunk,
    cleanText,
    calculateMetrics,
    chunks,
    similarChunks,
    flaggedChunks
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChunksStore, import.meta.hot))
}
