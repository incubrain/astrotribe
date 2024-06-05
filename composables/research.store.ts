// Define a type for the data structure
interface ResearchData {
  data: any[]
  flagged: any[]
}

export type ResearchDataKey =
  | 'research'
  | 'research_notes'
  | 'research_math'
  | 'research_figures'
  | 'research_tables'
  | 'research_authors'
  | 'research_citations'
  | 'research_tools'
  | 'research_metrics'
  | 'research_embeddings'
  | 'research_metrics_totals'
  | 'research_metrics_monthly_totals'

export interface ResearchMetricTotal {
  month_start: string
  row_count: number
  total_chunks: number
  avg_chunk_length: number
  smallest_chunk_length: number
  largest_chunk_length: number
  total_citations: number
  total_figures: number
  total_math: number
  total_tables: number
  total_notes: number
  total_tools: number
  total_authors: number
  total_chunk_length: number
  total_math_length: number
  total_tools_length: number
  total_authors_length: number
  total_notes_length: number
  total_tables_length: number
  total_abstract_length: number
  total_citations_length: number
  total_figures_length: number
}

export interface MetricDetail {
  start: number;
  end: number;
  total_duration: number;
  memory_usage_start: number;
  memory_usage_end: number;
  memory_usage_diff: number;
  processing_time?: number;
}

export interface ResearchMetric {
  research_id: string;
  error_count: number;
  errors: any;
  chunks: {
    avg_length: number;
    smallest: number | null;
    largest: number;
    lengths: number[];
    undersized: number[];
    oversized: number[];
  };
  performance: {
    start: number;
    end: number;
    total_duration: number;
    memory_usage_diff: number;
    memory_usage_start: number;
    memory_usage_end: number;
    processing_time: number;
    chunking: MetricDetail;
  };
  count: {
    chunks: number;
    tables: number;
    notes: number;
    tools: number;
    authors: number;
    citations: number;
    figures: number;
    math: number;
  };
  length: {
    chunks: number;
    math: number;
    tools: number;
    authors: number;
    notes: number;
    tables: number;
    abstract: number;
    citations: number;
    figures: number;
  };
}

// Initialize reactive data with flagged property

export const useResearchStore = defineStore('storeResearch', () => {
  const client = useSupabaseClient()
  const log = useLogger('storeResearch')
  const baseFetch = useBaseFetch()
  const toast = useNotification()

  const researchMetrics = ref<any[]>([])

  const researchData = reactive<Record<ResearchDataKey, ResearchData>>({
    research_notes: { data: [], flagged: [] },
    research_math: { data: [], flagged: [] },
    research_figures: { data: [], flagged: [] },
    research_tables: { data: [], flagged: [] },
    research_authors: { data: [], flagged: [] },
    research_citations: { data: [], flagged: [] },
    research_tools: { data: [], flagged: [] },
    research_embeddings: { data: [], flagged: [] },
    research: { data: [], flagged: [] },
    research_metrics: { data: [] }
  })

  interface ResearchInput {
    tableName: ResearchDataKey
    isFlagged?: boolean
    limit?: number
  }

  const lastNRows = ref({
    research: [],
    research_metrics: [],
    research_authors: [],
    research_citations: [],
    research_embeddings: [],
    research_figures: [],
    research_math: [],
    research_notes: [],
    research_tables: [],
    research_tools: [],
    research_metrics_monthly_totals: [],
    research_metrics_totals: []
  }) as Ref<Record<ResearchDataKey, ResearchMetrics[]>>

  const fetchNRows = async ({
    tableName,
    isFlagged = false,
    limit = 50
  }: ResearchInput): Promise<void> => {
    try {
      const { data, error } = (await client
        .from(tableName)
        .select('*')
        .order('month_start', { ascending: false })
        .limit(limit)) as { data: ResearchMetrics[]; error: any }

      console.log('fetchNRows:', data, error)
      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      lastNRows.value[tableName].push(...data)
    } catch (error) {
      console.error('Unexpected error:', error)
      return
    }
  }

  async function fetchFromResearchTables({ tableName, isFlagged, limit = 100 }: ResearchInput) {
    try {
      let query = client.from(tableName).select('*')

      if (isFlagged !== undefined) {
        query = query.eq('is_flagged', isFlagged).order('updated_at', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.range(0, limit)

      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        return
      }

      if (isFlagged) {
        researchData[tableName].flagged.push(...data)
      } else {
        researchData[tableName].data.push(...data)
      }
    } catch (error: any) {
      log.error(`fetchFromTable (${tableName}):`, error)
      toast.error({ summary: 'Error fetching data', message: error.message })
      throw new Error(error.message)
    }
  }

  interface Flag {
    tableName: ResearchDataKey
    isFlagged: boolean
    itemId: string
  }

  async function flagItem({ tableName, isFlagged, itemId }: Flag) {
    console.log('flagItem:', itemId, isFlagged)
    try {
      const { data, error } = await client
        .from(tableName)
        .update({ is_flagged: !isFlagged })
        .eq('id', itemId)
        .select()

      console.log('flagItem: res', data, error)
      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        return
      }

      const updatedItem = data[0]

      if (updatedItem && updatedItem.is_flagged) {
        researchData[tableName].flagged.push(updatedItem)
        researchData[tableName].data = researchData[tableName].data.filter(
          (item: any) => item.id !== updatedItem.id
        )
      } else {
        researchData[tableName].flagged = researchData[tableName].flagged.filter(
          (item: any) => item.id !== updatedItem.id
        )
        researchData[tableName].data.push(updatedItem)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async function deleteItem(itemId: number, tableName: ResearchDataKey) {
    log.info('deleteItem:', itemId)
    try {
      const { error } = await client.from(tableName).delete().eq('id', itemId)

      console.log('deleteItem: res', error)
      if (error) {
        throw new Error(error.message)
      }

      researchData[tableName].flagged = researchData[tableName].flagged.filter(
        (item: any) => item.id !== itemId
      )
      toast.info({ summary: 'Item Deleted', message: 'The item has been deleted' })
    } catch (error: any) {
      toast.error({ summary: 'Error Deleting Item', message: error.message })
      throw new Error(error.message)
    }
  }

  async function getResearchMetricsById(researchIds: number[]) {
    if (!Array.isArray(researchIds) || researchIds.length === 0) {
      throw new Error('Invalid input: researchIds must be a non-empty array.')
    }

    const { data, error } = await client
      .from('research_metrics')
      .select('*')
      .in('research_id', researchIds)

    if (error) {
      console.error('Error fetching research metrics:', error)
      throw error
    }

    return data as ResearchMetric[]
  }

  return {
    fetchFromResearchTables,
    getResearchMetricsById,
    researchData,
    researchMetrics,
    fetchNRows,
    flagItem,
    deleteItem,
    lastNRows
  }
})
