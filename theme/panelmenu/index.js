export default {
  panel: {
    class: 'mb-1',
  },
  header: {
    class: [
      'rounded-md',
      'outline-none',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-primary-300/50',
    ],
  },
  headerContent: ({ context, instance }) => ({
    class: [
      // Shape
      'rounded-t-md',
      {
        'rounded-br-md rounded-bl-md': !context.active || instance.activeItem?.items === undefined,
        'rounded-br-0 rounded-bl-0': context.active && instance.activeItem?.items !== undefined,
      },

      // Color
      'border border-color ',
      'bg-surface-400',
      'text-surface-0/80',
      { 'text-surface-900': context.active },

      // States
      'hover:bg-surface-700',
      'hover:text-surface-900',

      // Transition
      'transition duration-200 ease-in-out',
      'transition-shadow duration-200',
    ],
  }),
  headerLink: {
    class: [
      'relative',

      // Font
      'font-bold',
      'leading-none',

      // Flex & Alignments
      'flex items-center',

      // Spacing
      'p-5',

      // Misc
      'select-none cursor-pointer no-underline',
    ],
  },
  headerLabel: {
    class: 'leading-none',
  },
  headerIcon: {
    class: 'mr-2',
  },
  submenuIcon: {
    class: 'mr-2',
  },
  content: {
    class: [
      // Spacing
      'py-2',

      // Shape
      'border border-t-0',
      'rounded-t-none rounded-br-md rounded-bl-md',

      // Color
      'text-white/80',
      'bg-surface-400',
      'border-color ',
    ],
  },
  rootList: {
    class: ['outline-none', 'm-0 p-0 list-none'],
  },
  itemContent: {
    class: [
      // Shape
      'border-none rounded-none',

      // Color
      'text-white/80',

      // Transition
      'transition-shadow duration-200',
    ],
  },
  itemLink: ({ context }) => ({
    class: [
      'relative',

      // Font
      'leading-none',

      // Flex & Alignments
      'flex items-center',

      // Spacing
      'py-3 px-5',

      // Color
      'text-white/80',

      // States
      'hover:bg-surface-700/80 hover:hover:text-white/80',
      {
        'text-white/80 bg-surface-600/90': context.focused,
      },

      // Misc
      'cursor-pointer no-underline',
      'select-none overflow-hidden',
    ],
  }),
  itemIcon: {
    class: 'mr-2',
  },
  submenu: {
    class: 'p-0 pl-4 m-0 list-none',
  },
  transition: {
    enterFromClass: 'max-h-0',
    enterActiveClass:
      'overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]',
    enterToClass: 'max-h-[1000px]',
    leaveFromClass: 'max-h-[1000px]',
    leaveActiveClass:
      'overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]',
    leaveToClass: 'max-h-0',
  },
}
