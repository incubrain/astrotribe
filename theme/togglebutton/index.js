export default {
  root: ({ props }) => ({
    class: [
      'relative',

      // Alignment
      'flex items-center justify-center',
      'px-3 py-2',
      'rounded-md border',

      // Color
      {
        'bg-surface-900 ': !props.modelValue,
        'border-color  ': !props.modelValue && !props.invalid,
        'text-white/80': !props.modelValue,
        'bg-primary border-primary text-primary-contrast': props.modelValue,
      },

      // States
      {
        'hover:hover:text-white/80': !props.disabled && !props.modelValue,
        'focus:outline-none focus:outline-offset-0 focus-visible:ring-1 focus-visible:ring-primary-400':
          !props.disabled,
      },

      // Invalid State
      { 'border-red-400': props.invalid },

      // Before
      'before:absolute before:left-1 before:top-1 before:w-[calc(100%-0.5rem)] before:h-[calc(100%-0.5rem)] before:rounded-[4px] before:z-0',

      // Transitions
      'transition-all duration-200',

      // Misc
      {
        'cursor-pointer': !props.disabled,
        'opacity-60 select-none pointer-events-none cursor-default': props.disabled,
      },

      // Misc
      'cursor-pointer',
      'select-none',
    ],
  }),
  content: 'relative items-center inline-flex justify-center gap-2',
  label: 'font-bold text-center w-full z-10 relative',
  icon: 'relative z-10 mr-2',
}
