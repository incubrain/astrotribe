import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type { DataTableFilterMeta } from 'primevue/datatable'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useStorage } from '@vueuse/core'
import type { createCRUDComposable } from './ib/crud-factory.ib'
import { Icon } from '#components'

export interface AdminColumn<T> {
  field: keyof T
  header: string
  sortable?: boolean
  filter?: boolean
  filterMatchMode?: string
  bodyComponent?: (item: T) => any
  editComponent?: (item: T, field: keyof T) => any
  insertComponent?: () => any
  width?: string
}

export function createAdminDashboard<T extends { id: string | number }>(
  entityName: string,
  columns: AdminColumn<T>[],
  useEntityComposable: () => ReturnType<ReturnType<typeof createCRUDComposable<T>>>,
) {
  return defineComponent({
    name: `${entityName}AdminDashboard`,
    props: {
      title: {
        type: String,
        default: `Manage ${entityName}`,
      },
      customActions: {
        type: Object as PropType<Record<string, (item: T) => void>>,
        default: () => ({}),
      },
    },
    setup(props) {
      const { entities, isLoading, fetchEntities, insertEntity, updateEntity, deleteEntity } =
        useEntityComposable()
      const confirm = useConfirm()
      const filters = ref({})
      const showInsertDialog = ref(false)
      const newEntity = ref({} as Omit<T, 'id'>)

      const orderedColumns = ref<(keyof T)[]>(columns.map((col) => col.field))
      const handleRowEditSave = async (event: { data: T; newData: Partial<T> }) => {
        try {
          await updateEntity(event.data.id, event.newData)
        } catch (error) {
          // Handle error (e.g., show toast message)
        }
      }

      const onColumnReorder = (event: { dragIndex: number; dropIndex: number }) => {
        const newOrder = [...orderedColumns.value]
        const [reorderedItem] = newOrder.splice(event.dragIndex, 1)
        newOrder.splice(event.dropIndex, 0, reorderedItem)
        orderedColumns.value = newOrder
      }

      const onCellEditComplete = async (event) => {
        const { data, newValue, field, oldValue } = event
        // 4. Only trigger the update function if the value has changed
        if (newValue !== oldValue) {
          console.log('updating', newValue, oldValue)
          try {
            await updateEntity(data.id, { [field]: newValue })
          } catch (error) {
            // Handle error (e.g., show toast message)
          }
        }
      }

      const handleDeleteEntity = (item: T) => {
        confirm.require({
          message: `Are you sure you want to delete this ${entityName}?`,
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
            try {
              await deleteEntity(item.id)
              // Show success message
            } catch (error) {
              // Handle error (e.g., show toast message)
            }
          },
        })
      }

      const handleInsertEntity = async () => {
        try {
          await insertEntity(newEntity.value)
          showInsertDialog.value = false
          newEntity.value = {} as Omit<T, 'id'>
          // Show success message
        } catch (error) {
          // Handle error (e.g., show toast message)
        }
      }

      onMounted(() => {
        fetchEntities()
      })

      return {
        entities,
        isLoading,
        handleRowEditSave,
        handleDeleteEntity,
        handleInsertEntity,
        onCellEditComplete,
        onColumnReorder,
        filters,
        showInsertDialog,
        newEntity,
        orderedColumns,
      }
    },
    render() {
      return h('div', { class: 'admin-dashboard' }, [
        h('h2', { class: 'text-2xl font-bold mb-4' }, this.title),
        h(Button, {
          label: `Add New ${entityName}`,
          class: 'p-button-success mb-4',
          onClick: () => (this.showInsertDialog = true),
        }),
        h(
          DataTable,
          {
            value: this.entities,
            paginator: true,
            rows: 100,
            filters: this.filters,
            editMode: 'cell',
            onCellEditComplete: this.onCellEditComplete,
            loading: this.isLoading,
            responsiveLayout: 'scroll',
            resizableColumns: true,
            columnResizeMode: 'expand',
            showGridlines: true,
            reorderableColumns: true,
            onColumnReorder: this.onColumnReorder,
          },
          {
            header: () =>
              h('div', { class: 'flex justify-between' }, [
                h(InputText, {
                  modelValue: this.filters['global']?.value,
                  'onUpdate:modelValue': (value) => {
                    this.filters['global'] = { value, matchMode: 'contains' }
                  },
                  placeholder: 'Global Search',
                }),
              ]),
            default: () =>
              this.orderedColumns
                .map((field, index) => {
                  const col = columns.find((c) => c.field === field)
                  if (!col) return null
                  return h(
                    Column,
                    {
                      key: col.field,
                      field: col.field,
                      header: col.header,
                      sortable: col.sortable ?? true,
                      filter: col.filter ?? true,
                      filterMatchMode: col.filterMatchMode ?? 'contains',
                      class: 'whitespace-nowrap overflow-hidden',
                      style: { maxWidth: col.width || '200px' },
                    },
                    {
                      body: (slotProps) =>
                        col.bodyComponent
                          ? col.bodyComponent(slotProps.data)
                          : slotProps.data[col.field],
                      editor: (slotProps) =>
                        col.editComponent
                          ? col.editComponent(slotProps.data, col.field)
                          : h(InputText, {
                              modelValue: slotProps.data[col.field],
                              'onUpdate:modelValue': (value) => (slotProps.data[col.field] = value),
                            }),
                    },
                  )
                })
                .filter(Boolean)
                .concat([
                  h(Column, {
                    key: 'row-editor',
                    rowEditor: true,
                    style: { width: '10%', minWidth: '8rem' },
                  }),
                  h(
                    Column,
                    {
                      key: 'actions',
                      header: 'Actions',
                      style: { width: '10%', minWidth: '8rem' },
                      class: 'whitespace-nowrap',
                    },
                    {
                      body: (slotProps) => [
                        h(Button, {
                          label: 'delete',
                          severity: 'danger',
                          size: 'small',
                          onClick: () => this.handleDeleteEntity(slotProps.data),
                        }),
                        ...Object.entries(this.customActions).map(([label, action]) =>
                          h(Button, {
                            label,
                            onClick: () => action(slotProps.data),
                          }),
                        ),
                      ],
                    },
                  ),
                ]),
          },
        ),
        h(
          Dialog,
          {
            header: `Add New ${entityName}`,
            visible: this.showInsertDialog,
            'onUpdate:visible': (value) => (this.showInsertDialog = value),
            style: { width: '50vw' },
          },
          {
            default: () => [
              ...this.orderedColumns
                .filter((col) => col.field !== 'id')
                .map((col) =>
                  h('div', { class: 'field' }, [
                    h('label', { for: col.field }, col.header),
                    col.insertComponent
                      ? col.insertComponent()
                      : h(InputText, {
                          id: col.field,
                          modelValue: this.newEntity[col.field],
                          'onUpdate:modelValue': (value) => (this.newEntity[col.field] = value),
                          class: 'w-full',
                        }),
                  ]),
                ),
              h(Button, {
                label: `Add ${entityName}`,
                onClick: this.handleInsertEntity,
              }),
            ],
          },
        ),
        h(ConfirmDialog),
      ])
    },
  })
}
