export default {
  root: {
    class: [
      // Sizing and Shape
      'min-w-[12rem]',
      'rounded-md',
      // Spacing
      'py-2',
      // Colors
      'bg-surface-700',
      'text-white/80',
      'border border-color ',
    ],
  },
  list: {
    class: [
      // Spacings and Shape
      'list-none',
      'm-0',
      'p-0',
      'outline-none',
    ],
  },
  itemContent: ({ context }) => ({
    class: [
      // Shape
      'rounded-none',
      // Colors
      'text-white/80',
      {
        'text-white': context.focused,
      },
      // Transitions
      'transition-shadow',
      'duration-200',
      // States
      'hover:hover:text-white/80',
      'hover:bg-surface-900/10',
    ],
  }),
  itemLink: {
    class: [
      'relative',
      // Flexbox

      'flex',
      'items-center',

      // Spacing
      'py-3',
      'px-5',

      // Color
      'text-white/80',

      // Misc
      'no-underline',
      'overflow-hidden',
      'cursor-pointer',
      'select-none',
    ],
  },
  itemIcon: {
    class: [
      // Spacing
      'mr-2',

      // Color
      'text-surface-600 text-white/70',
    ],
  },
  itemLabel: {
    class: ['leading-none'],
  },
  submenuLabel: {
    class: [
      // Font
      'font-bold',
      // Spacing
      'm-0',
      'py-3 px-5',
      // Shape
      'rounded-tl-none',
      'rounded-tr-none',
      // Colors
      'bg-surface-700',
      'text-white',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
}
