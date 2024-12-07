// stores/adminTables.ts
import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'

export const useAdminTablesStore = defineStore('adminTables', () => {
  const supabase = useSupabaseClient()
  const logger = useLogger('admin')

  // State
  const tables = ref<TableInfo[]>([])
  const loading = ref(false)
  const structureCache = new Map<string, TableStructureInfo[]>()

  // Database operations
  const fetchAvailableTables = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('get_available_tables')
      if (error) throw error
      tables.value = data
      logger.info('Tables fetched:', { tables: tables.value })
      return data
    } catch (error) {
      logger.error('Error fetching tables:', { error })
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTableStructure = async (tableName: string) => {
    if (structureCache.has(tableName)) {
      return structureCache.get(tableName)!
    }

    try {
      const [structure, metadata] = await Promise.all([
        supabase.rpc('get_table_structure', { target_table_name: tableName }),
        supabase.rpc('get_column_metadata', { target_table_name: tableName }),
      ])

      console.log('structure', tableName, structure, metadata)

      if (structure.error) {
        throw structure.error
      }

      if (metadata.error) {
        throw metadata.error
      }

      // Combine the results
      const combined = structure.data.map((col) => ({
        ...col,
        ...metadata.data.find((m) => m.column_name === col.column_name),
      }))

      const typedStructure: TableStructureInfo[] = combined

      // Cache the result
      structureCache.set(tableName, typedStructure)

      return typedStructure
    } catch (error) {
      logger.error('Error fetching table structure:', { error, tableName })
      throw error
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      const { data, error } = await supabase.from(tableName).select('*')
      if (error) throw error
      return data
    } catch (error) {
      logger.error(`Error fetching table data for ${tableName}`, { error })
      throw error
    }
  }

  const updateRecord = async (tableName: string, record: any) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(record)
        .eq('id', record.id)
        .select()
        .single()

      if (error) throw error

      logger.info('Record updated:', { tableName, recordId: record.id })
      return data
    } catch (error) {
      logger.error('Error updating record:', { tableName, error })
      throw error
    }
  }

  const deleteRecords = async (tableName: string, ids: string[]) => {
    try {
      const { error } = await supabase.from(tableName).delete().in('id', ids)

      if (error) throw error

      logger.info('Records deleted:', { tableName, count: ids.length })
      return true
    } catch (error) {
      logger.error('Error deleting records:', { tableName, error })
      throw error
    }
  }

  const insertRecord = async (tableName: string, record: any) => {
    try {
      const { data, error } = await supabase.from(tableName).insert(record).select().single()

      if (error) throw error

      logger.info('Record inserted:', { tableName, recordId: data.id })
      return data
    } catch (error) {
      logger.error('Error inserting record:', { tableName, error })
      throw error
    }
  }

  return {
    // State
    tables,
    loading,

    // Actions
    fetchTableStructure,
    fetchTableData,
    fetchAvailableTables,
    updateRecord,
    deleteRecords,
    insertRecord,
  }
})
