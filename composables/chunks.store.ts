interface BaseNotification {
  summary: string
  message: string
}

export const useChunksStore = defineStore('chunksStore', () => {
  const log = useLogger('chunksStore')
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
      log.error('fetchChunks:', error)
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
    log.info('deleteChunk:', chunkId)
    try {
      const { error } = await client.from('research_embeddings').delete().eq('id', chunkId)

      console.log('deleteChunk: res', error)
      if (error) {
        throw new Error(error.message)
      }

      flaggedChunks.value = flaggedChunks.value.filter((chunk: any) => chunk.id !== chunkId)
      toast.info({ summary: 'Chunk Deleted', message: 'The chunk has been deleted' })
    } catch (error: any) {
      toast.error({ summary: 'Error Deleting Chunk', message: error.message })
      throw new Error(error.message)
    }
  }

  function cleanText(text: string) {
    // Regular expression to match the pattern [chars(num/char/|)]
    const withoutPlaceholders = text.replace(/\[research_.*?\([^\)]+\)\]/g, '')

    return withoutPlaceholders
      .replace(/undefined/g, '')
      .replace(/ ,/g, ',')
      .replace(/ ,/g, '')
      .replace(/ :/g, ':')
      .replace(/ \./g, '.')
      .replace(/ ;/g, ';')
      .replace(/ \(/g, '(')
      .replace(/ \)/g, ')')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return {
    flagChunk,
    fetchChunks,
    fetchSimilarDocuments,
    deleteChunk,
    cleanText,
    chunks,
    similarChunks,
    flaggedChunks
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChunksStore, import.meta.hot))
}
