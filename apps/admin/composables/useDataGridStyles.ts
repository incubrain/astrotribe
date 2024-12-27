// composables/useDataGridStyles.ts
export function useDataGridStyles() {
  const tablePassThroughOptions = {
    root: { class: 'border-none' },
    table: { class: 'border-none' },
    thead: { class: 'border-none' },
    headerRow: {
      class: ['sticky  top-0 background border-b border-color'],
    },
    headerCell: {
      class: ['text-xs font-medium py-3 px-4 border-b border-color whitespace-nowrap background'],
    },
    tbody: { class: 'border-none' },
    bodyRow: {
      class: ({ state }) => ['transition-colors', { 'bg-primary-900': state.selected }],
    },
    bodyCell: {
      class: ['text-sm px-4 py-3 border-b border-color whitespace-nowrap'],
    },
  }

  const selectionColumnPt = {
    headerCell: {
      class: 'sticky left-0 z-10 background',
    },
    bodyCell: {
      class: 'sticky left-0 z-10 background',
    },
  }

  const columnPt = {
    headerCell: {
      class: ['text-xs font-medium whitespace-nowrap overflow-hidden'],
    },
    bodyCell: {
      class: ['text-sm overflow-hidden'],
    },
  }

  return {
    tablePassThroughOptions,
    selectionColumnPt,
    columnPt,
  }
}
