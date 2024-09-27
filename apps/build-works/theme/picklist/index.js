export default {
  root: 'flex [&_[data-pc-name=pclist]]:h-full',
  sourceControls: {
    class: [
      // Flexbox & Alignment
      'flex lg:flex-col justify-center gap-2',

      // Spacing
      'p-5',
    ],
  },
  sourceListContainer: {
    class: [
      // Flexbox
      'grow shrink basis-2/4',

      // Shape
      'rounded-md',

      // Color
      'bg-surface-400',
      'border border-color ',
      'outline-none',
    ],
  },
  transferControls: {
    class: 'flex lg:flex-col justify-center gap-2 p-5',
  },
  targetListContainer: {
    class: [
      // Flexbox
      'grow shrink basis-2/4',

      // Shape
      'rounded-md',

      // Color
      'bg-surface-400',
      'border border-color ',
      'outline-none',
    ],
  },
  targetControls: {
    class: 'flex lg:flex-col justify-center gap-2 p-5',
  },
  transition: {
    enterFromClass: '!transition-none',
    enterActiveClass: '!transition-none',
    leaveActiveClass: '!transition-none',
    leaveToClass: '!transition-none',
  },
}
