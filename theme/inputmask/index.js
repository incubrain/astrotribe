export default {
  root: ({ context, props, parent }) => ({
    class: [
      // Font
      'leading-[normal]',

      // Spacing
      'm-0 p-3',

      // Colors
      'text-surface-200',
      'placeholder:text-surface-100',
      'bg-surface-900',

      'border',
      { 'border-surface-600': !props.invalid },

      // Invalid State
      'invalid:focus:ring-red-200',
      'invalid:hover:border-red-500',
      { 'border-red-400': props.invalid },

      // States
      {
        'hover:border-primary': !context.disabled && !props.invalid,
        'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50':
          !context.disabled,
        'opacity-60 select-none pointer-events-none cursor-default': context.disabled,
      },

      // Filled State *for FloatLabel
      {
        filled:
          parent.instance?.$name == 'FloatLabel' &&
          props.modelValue !== null &&
          props.modelValue?.length !== 0,
      },

      // Misc
      'rounded-md',
      'appearance-none',
      'transition-colors duration-200',
    ],
  }),
}
