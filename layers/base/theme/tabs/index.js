export default {
  tabs: {
    root: ({ props }) => ({
      class: ['flex flex-col', { '[&>[data-pc-name=tablist]]:overflow-hidden': props.scrollable }],
    }),
  },
  tablist: {
    root: 'relative flex',
    content:
      'overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain overscroll-y-auto [&::-webkit-scrollbar]:hidden grow',
    tabList: 'relative flex border-solid border-none',
    nextButton:
      '!absolute top-0 right-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-900 outline-transparent cursor-pointer  shrink-0',
    prevButton:
      '!absolute top-0 left-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-900 outline-transparent cursor-pointer shrink-0',
    activeBar: 'z-10 block absolute h-0 bottom-0',
  },
  tabpanels: {
    root: 'bg-surface-900 text-surface-900 dark:text-surface-0/80 outline-0 p-[1.125rem] pt-[0.875rem]',
  },
  tabpanel: {
    root: 'focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300',
  },
  tab: {
    root: ({ props, context }) => ({
      class: [
        'relative shrink-0',
        // Transitions
        'transition-all duration-200',
        // Misc
        'cursor-pointer select-none whitespace-nowrap',
        'user-select-none',
        // Shape
        'border-t-2',
        'rounded-b-md',
        // Spacing
        'py-4 px-[1.125rem]',
        '-mb-px',
        // Colors and Conditions
        'outline-transparent',
        {
          'border-transparent': !context.active,
          'bg-surface-900': !context.active,
          'text-surface-700 dark:text-surface-0/80': !context.active,
          'bg-surface-900': context.active,
          'border-primary': context.active,
          'text-primary': context.active,
          'opacity-60 cursor-default user-select-none select-none pointer-events-none':
            props == null ? void 0 : props.disabled,
        },
        // States
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset',
        'focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
        {
          'hover:bg-surface-600 dark:hover:bg-surface-800/80': !context.active,
          'hover:text-surface-900 dark:hover:text-surface-0': !context.active,
        },
      ],
    }),
  },
}
