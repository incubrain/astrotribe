export default {
  button: ({ props }) => ({
    root: {
      class: [
        // Flex & Alignment
        'flex items-center justify-center',

        // Positioning
        {
          '!sticky flex ml-auto': props.target === 'parent',
          '!fixed': props.target === 'window',
        },
        'bottom-[20px] right-[20px]',
        'h-12 w-12 rounded-full shadow-md',
        'text-white text-surface-900 0 bg-surface-400',
        'hover:bg-surface-300',
      ],
    },
  }),
  transition: {
    enterFromClass: 'opacity-0',
    enterActiveClass: 'transition-opacity duration-150',
    leaveActiveClass: 'transition-opacity duration-150',
    leaveToClass: 'opacity-0',
  },
}
