export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      'inline-flex',
      'relative',

      // Shape
      'rounded-md',

      // Color and Background
      'bg-surface-900',
      'border',
      'border-color',
      { 'border-surface-600': !props.invalid },

      // Invalid State
      { 'border-red-400': props.invalid },

      // Transitions
      'transition-all',
      'duration-200',

      // States
      { 'hover:border-primary': !props.invalid },
      {
        'outline-none outline-offset-0 ring ring-primary-300/50': state.focused,
      },

      // Misc
      'cursor-pointer',
      'select-none',
      {
        'opacity-60': props.disabled,
        'pointer-events-none': props.disabled,
        'cursor-default': props.disabled,
      },
    ],
  }),
  labelContainer: 'overflow-hidden flex flex-auto cursor-pointer',
  label: ({ props }) => ({
    class: [
      'leading-[normal]',
      'block ',

      // Spacing
      {
        'p-3': props.display !== 'chip',
        'py-3 px-3': props.display === 'chip' && !props?.modelValue?.length,
        'py-[0.375rem] px-3': props.display === 'chip' && props?.modelValue?.length > 0,
      },

      // Color
      {
        'text-white/80': props.modelValue?.length,
        'text-surface-50': !props.modelValue?.length,
      },
      'placeholder:text-surface-100',

      // Transitions
      'transition duration-200',

      // Misc
      'overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis',
    ],
  }),
  dropdown: {
    class: [
      // Flexbox
      'flex items-center justify-center',
      'shrink-0',

      // Color and Background
      'bg-transparent',
      'text-surface-50',
      'border-color',

      // Size
      'w-12',

      // Shape
      'rounded-tr-md',
      'rounded-br-md',
    ],
  },
  overlay: {
    class: [
      // Position

      // Shape
      'border',
      'border-color',
      'rounded-md',
      'shadow-md',

      // Color
      'bg-surface-400',
      'text-white/80',
      '',
    ],
  },
  header: {
    class: [
      'flex items-center justify-between',
      // Spacing
      'py-3 px-5 gap-2',
      'm-0',

      // Shape
      'border-b',
      'rounded-tl-md',
      'rounded-tr-md',

      // Color
      'text-white/80',
      'bg-surface-400',
      'border-color',

      '[&_[data-pc-name=pcfiltercontainer]]:!flex-auto',
      '[&_[data-pc-name=pcfilter]]:w-full',
    ],
  },
  listContainer: {
    class: [
      // Sizing
      'max-h-[200px]',

      // Misc
      'overflow-auto',
    ],
  },
  list: {
    class: 'py-3 list-none m-0',
  },
  option: ({ context }) => ({
    class: [
      // Font
      'font-normal',
      'leading-none',

      // Flexbox
      'flex items-center',

      // Position
      'relative',

      // Shape
      'border-0',
      'rounded-none',

      // Spacing
      'm-0',
      'py-3 px-5 gap-2',

      // Color
      { 'text-white/80': !context.focused && !context.selected },
      {
        'bg-surface-600/60 text-white/80': context.focused && !context.selected,
      },
      { 'bg-highlight': context.selected },

      // States
      {
        'hover:bg-surface-600/80': !context.focused && !context.selected,
      },
      {
        'hover:text-surface-100 hover:text-white hover:bg-surface-600/80':
          context.focused && !context.selected,
      },

      // Transitions
      'transition-shadow',
      'duration-200',

      // Misc
      'cursor-pointer',
      'overflow-hidden',
      'whitespace-nowrap',
    ],
  }),
  optionGroup: {
    class: [
      // Font
      'font-bold',

      // Spacing
      'm-0',
      'p-3 px-5',

      // Color
      'text-white/80',
      'bg-surface-600/80',

      // Misc
      'cursor-auto',
    ],
  },
  emptyMessage: {
    class: [
      // Font
      'leading-none',

      // Spacing
      'py-3 px-5',

      // Color
      'text-white/80',
      'bg-transparent',
    ],
  },
  loadingIcon: {
    class: 'text-surface-50 animate-spin',
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
}
