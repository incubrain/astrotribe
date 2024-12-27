// composables/useTableData.ts
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

interface TableStructure {
  column_name: string
  data_type: string
  is_nullable: boolean
  column_default: string | null
  is_identity: boolean
  is_generated: boolean
  character_maximum_length: number | null
  numeric_precision: number | null
  numeric_scale: number | null
  constraints: any[]
  foreign_key_info: any
}

export function useTableData(tableName: string) {
  const store = useAdminTablesStore()
  const logger = useLogger('admin')

  const data = ref<any[]>([])
  const columns = ref<any[]>([])
  const loading = ref(true)

  const processColumns = (structure: TableStructure[]) => {
    return structure.map((col) => ({
      field: col.column_name,
      column_name: col.column_name,
      data_type: col.data_type,
      is_nullable: col.is_nullable,
      is_identity: col.is_identity,
      is_generated: col.is_generated,
      character_maximum_length: col.character_maximum_length,
      numeric_precision: col.numeric_precision,
      numeric_scale: col.numeric_scale,
      constraints: col.constraints,
      foreign_key_info: col.foreign_key_info,
      sortable: true,
      editable:
        !['id', 'created_at', 'updated_at'].includes(col.column_name) &&
        !col.is_identity &&
        !col.is_generated,
    }))
  }

  const loadData = async () => {
    loading.value = true
    try {
      // Using store methods instead of direct DB calls
      const [structure, tableData] = await Promise.all([
        store.fetchTableStructure(tableName),
        store.fetchTableData(tableName),
      ])

      console.log('structure', structure, tableData)

      columns.value = processColumns(structure)
      data.value = tableData

      logger.info('Data loaded successfully', { tableName })
    } catch (error: any) {
      logger.error('Error loading data:', { error, tableName })
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    columns,
    loading,
    loadData,
  }
}
