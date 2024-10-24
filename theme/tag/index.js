export default {
  root: ({ props }) => ({
    class: [
      // Font
      'text-xs font-bold',

      // Alignments
      'inline-flex items-center justify-center',

      // Spacing
      'px-2 py-1',

      // Shape
      {
        'rounded-md': !props.rounded,
        'rounded-full': props.rounded,
      },

      // Colors
      'text-surface-100',
      {
        'bg-primary-800':
          props.severity == null || props.severity === 'primary',
        'text-surface-300 bg-surface-900/20': props.severity === 'secondary',
        'bg-green-950': props.severity === 'success',
        'bg-blue-950': props.severity === 'info',
        'bg-orange-950': props.severity === 'warn',
        'bg-red-950': props.severity === 'danger',
        'text-surface-950 bg-surface-100': props.severity === 'contrast',
      },
    ],
  }),
  value: {
    class: 'leading-normal',
  },
  icon: {
    class: 'mr-1 text-sm',
  },
}
