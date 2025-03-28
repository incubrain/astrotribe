export default {
  root: {
    class: [
      // Shape
      'rounded-md shadow-lg',
      'border',

      // Position
      'absolute left-0 top-0 mt-2',
      'z-40 transform origin-center',

      // Color
      'bg-surface-400',
      'text-surface-0/80',
      '',

      // Before: Arrow
      'before:absolute before:w-0 before:-top-3 before:h-0 before:border-transparent before:border-solid before:ml-[10px] before:border-x-[10px] before:border-b-[10px] before:border-t-0 before:border-b-surface-700',
      'after:absolute after:w-0 after:-top-[0.54rem] after:left-[4px] after:h-0 after:border-transparent after:border-solid after:ml-[8px] after:border-x-[8px] after:border-b-[8px] after:border-t-0 after:border-b-surface-800',
    ],
  },
  content: {
    class: 'p-5 items-center flex',
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
}
