export default {
  root: ({ props, state, parent }) => ({
    class: [
      // Display and Position
      'inline-flex',
      'relative',

      // Shape
      { 'rounded-md': parent.instance.$name !== 'InputGroup' },
      {
        'first:rounded-l-md rounded-none last:rounded-r-md': parent.instance.$name == 'InputGroup',
      },
      {
        'border-0 border-y border-l last:border-r': parent.instance.$name == 'InputGroup',
      },
      {
        'first:ml-0 ml-[-1px]': parent.instance.$name == 'InputGroup' && !props.showButtons,
      },

      // Color and Background
      'bg-surface-400',

      'border border-surface-300',
      { '': parent.instance.$name != 'InputGroup' },
      { 'border-surface-600': parent.instance.$name == 'InputGroup' },
      { 'border-surface-600': !props.invalid },

      // Invalid State
      { 'border-red-400': props.invalid },

      // Transitions
      'transition-all',
      'duration-200',

      // States
      { 'hover:border-primary': !props.invalid },
      {
        'outline-none outline-offset-0 ring ring-primary-300/50':
          state.focused,
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
  label: ({ props, parent }) => ({
    class: [
      // Font
      'leading-[normal]',

      // Display
      'block',
      'flex-auto',

      // Color and Background
      'bg-transparent',
      'border-0',
      {
        'text-white/80': props.modelValue != undefined,
        'text-surface-50': props.modelValue == undefined,
      },

      // Sizing and Spacing
      'w-[1%]',
      'p-3',
      { 'pr-7': props.showClear },

      // Shape
      'rounded-none',

      // Transitions
      'transition',
      'duration-200',

      // States
      'focus:outline-none focus:shadow-none',

      // Filled State *for FloatLabel
      {
        filled: parent.instance?.$name == 'FloatLabel' && props.modelValue !== null,
      },

      // Misc
      'relative',
      'cursor-pointer',
      'overflow-hidden overflow-ellipsis',
      'whitespace-nowrap',
      'appearance-none',
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
      'absolute top-0 left-0',

      // Shape
      'border',
      'rounded-md',
      'shadow-md',

      // Color
      'bg-surface-400',
      'text-white/80',
      '',
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
    class: 'list-none m-0',
  },
  option: ({ context }) => ({
    class: [
      // Font
      'font-normal',
      'leading-none',

      // Position
      'relative',
      'flex items-center',

      // Shape
      'border-b',
      'border-surface-950',
      'rounded-none',

      // Spacing
      'm-0',
      'py-3 px-5',

      // Colors
      {
        'text-white/80': !context.selected,
        'bg-surface-400': context.focused && !context.selected,
        'bg-primary-950': context.selected,
      },

      // States
      {
        'hover:bg-surface-950': context.focused && !context.selected,
      },
      { 'hover:bg-primary-800': context.selected },
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-300/50',

      // Transitions
      'transition-shadow',
      'duration-200',

      // Misc
      { 'pointer-events-none cursor-default': context.disabled },
      { 'cursor-pointer': !context.disabled },
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
      'py-3 px-5',

      // Color
      'text-white/80',
      'bg-surface-400/80',

      // Misc
      'cursor-auto',
    ],
  },
  optionCheckIcon: 'relative -ms-1.5 me-1.5 text-white/80 w-4 h-4',
  optionBlankIcon: 'w-4 h-4',
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
  header: {
    class: [
      // Spacing
      'py-3 px-5',
      'm-0',

      // Shape
      'border-b',
      'rounded-tl-md',
      'rounded-tr-md',

      // Color
      'text-white/80',
      'bg-surface-400',
      'border-surface-300 ',
    ],
  },
  clearIcon: {
    class: [
      // Color
      'text-surface-50',

      // Position
      'absolute',
      'top-1/2',
      'right-12',

      // Spacing
      '-mt-2',
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
