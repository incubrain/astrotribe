export default {
  root: {
    class: [
      // Flexbox
      'inline-flex items-center',

      // Spacing
      'px-3 gap-2',

      // Shape
      'rounded-[16px]',

      // Colors
      'text-white/70',
      'bg-surface-700',
    ],
  },
  label: {
    class: 'leading-6 my-1.5 mx-0',
  },
  icon: {
    class: 'leading-6 mr-2',
  },
  image: {
    class: ['w-9 h-9 -ml-3 mr-2', 'rounded-full'],
  },
  removeIcon: {
    class: [
      // Shape
      'rounded-md leading-6',

      // Size
      'w-4 h-4',

      // Transition
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer',
    ],
  },
}
