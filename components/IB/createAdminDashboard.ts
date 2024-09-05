import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { createCRUDComposable } from '~/composables/ib/crud-factory.ib'

export interface AdminColumn<T> {
  field: keyof T
  header: string
  sortable?: boolean
  filter?: boolean
  filterMatchMode?: string
  bodyComponent?: (item: T) => any
  editComponent?: (item: T, field: keyof T) => any
  insertComponent?: () => any
}

export function createAdminDashboard<T extends { id: string | number }>(
  entityName: string,
  columns: AdminColumn<T>[],
  useEntityComposable: () => ReturnType<ReturnType<typeof createCRUDComposable<T>>>
) {
  return defineComponent({
    name: `${entityName}AdminDashboard`,
    props: {
      title: {
        type: String,
        default: `Manage ${entityName}`
      },
      customActions: {
        type: Object as PropType<Record<string, (item: T) => void>>,
        default: () => ({})
      }
    },
    setup(props) {
      const { entities, isLoading, fetchEntities, insertEntity, updateEntity, deleteEntity } =
        useEntityComposable()
      const confirm = useConfirm()
      const filters = ref({})
      const showInsertDialog = ref(false)
      const newEntity = ref({} as Omit<T, 'id'>)

      const handleRowEditSave = async (event: { data: T; newData: Partial<T> }) => {
        try {
          await updateEntity(event.data.id, event.newData)
        } catch (error) {
          // Handle error (e.g., show toast message)
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
          }
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
        filters,
        showInsertDialog,
        newEntity
      }
    },
    render() {
      return h('div', { class: 'admin-dashboard' }, [
        h('h2', { class: 'text-2xl font-bold mb-4' }, this.title),
        h(Button, {
          label: `Add New ${entityName}`,
          icon: 'pi pi-plus',
          class: 'mb-4',
          onClick: () => (this.showInsertDialog = true)
        }),
        h(
          DataTable,
          {
            value: this.entities,
            dataKey: 'id',
            paginator: true,
            rows: 10,
            filters: this.filters,
            editMode: 'row',
            onRowEditSave: this.handleRowEditSave,
            loading: this.isLoading,
            responsiveLayout: 'scroll'
          },
          {
            header: () =>
              h('div', { class: 'flex justify-between' }, [
                h(InputText, {
                  modelValue: this.filters['global']?.value,
                  'onUpdate:modelValue': (value) => {
                    this.filters['global'] = { value, matchMode: 'contains' }
                  },
                  placeholder: 'Global Search'
                })
              ]),
            default: () =>
              columns
                .map((col) =>
                  h(
                    Column,
                    {
                      field: col.field,
                      header: col.header,
                      sortable: col.sortable ?? true,
                      filter: col.filter ?? true,
                      filterMatchMode: col.filterMatchMode ?? 'contains'
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
                              'onUpdate:modelValue': (value) => (slotProps.data[col.field] = value)
                            })
                    }
                  )
                )
                .concat([
                  h(Column, { rowEditor: true, style: { width: '10%', minWidth: '8rem' } }),
                  h(
                    Column,
                    {
                      header: 'Actions',
                      style: { width: '10%', minWidth: '8rem' }
                    },
                    {
                      body: (slotProps) => [
                        h(Button, {
                          icon: 'pi pi-trash',
                          class: 'p-button-rounded p-button-danger p-button-text',
                          onClick: () => this.handleDeleteEntity(slotProps.data)
                        }),
                        ...Object.entries(this.customActions).map(([label, action]) =>
                          h(Button, {
                            label,
                            class: 'p-button-rounded p-button-text',
                            onClick: () => action(slotProps.data)
                          })
                        )
                      ]
                    }
                  )
                ])
          }
        ),
        h(
          Dialog,
          {
            header: `Add New ${entityName}`,
            visible: this.showInsertDialog,
            'onUpdate:visible': (value) => (this.showInsertDialog = value),
            style: { width: '50vw' }
          },
          {
            default: () => [
              ...columns
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
                          class: 'w-full'
                        })
                  ])
                ),
              h(Button, {
                label: `Add ${entityName}`,
                icon: 'pi pi-check',
                onClick: this.handleInsertEntity
              })
            ]
          }
        ),
        h(ConfirmDialog)
      ])
    }
  })
}
