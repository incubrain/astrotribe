export default {
  root: {
    class: [
      'relative',

      // Alignment
      'inline-flex',
      'align-bottom',

      // Size
      'w-6',
      'h-6',

      // Misc
      'cursor-pointer',
      'select-none',
    ],
  },
  box: ({ props, context }) => ({
    class: [
      // Alignment
      'flex',
      'items-center',
      'justify-center',

      // Size
      'w-6',
      'h-6',

      // Shape
      'rounded-md',
      'border-2',

      // Colors
      {
        'border-color bg-surface-400':
          !context.checked && !props.invalid,
        'border-primary bg-primary': context.checked,
      },

      // Invalid State
      { 'border-red-400': props.invalid },

      // States
      {
        'peer-hover:border-primary': !props.disabled && !context.checked && !props.invalid,
        'peer-hover:bg-primary-emphasis peer-hover:border-primary-emphasis':
          !props.disabled && context.checked,
        'peer-focus-visible:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300/20':
          !props.disabled,
        'cursor-default opacity-60': props.disabled,
      },

      // Transitions
      'transition-colors',
      'duration-200',
    ],
  }),
  input: {
    class: [
      'peer',

      // Size
      'w-full ',
      'h-full',

      // Position
      'absolute',
      'top-0 left-0',
      'z-10',

      // Spacing
      'p-0',
      'm-0',

      // Shape
      'opacity-0',
      'rounded-md',
      'outline-none',
      'border-2 border-color ',

      // Misc
      'appearance-none',
      'cursor-pointer',
    ],
  },
  icon: ({ state, context }) => ({
    class: [
      // Font
      'text-base leading-none',

      // Size
      'w-4',
      'h-4',

      // Colors
      {
        'text-white text-surface-900': context.checked,
        'text-primary': state.d_indeterminate,
      },

      // Transitions
      'transition-all',
      'duration-200',
    ],
  }),
}
