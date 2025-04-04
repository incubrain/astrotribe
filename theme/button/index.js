export default {
  root: ({ props, context, parent }) => ({
    class: [
      'relative',

      // Alignments
      'items-center inline-flex text-center align-bottom justify-center',
      {
        'flex-col': (props.iconPos === 'top' || props.iconPos === 'bottom') && props.label,
      },

      // Sizes & Spacing
      'leading-[normal]',
      {
        'px-4 py-[0.625rem]': props.size === null,
        'text-sm py-2 px-3': props.size === 'small',
        'text-xl py-3 px-4': props.size === 'large',
      },
      { 'gap-2': props.label !== null },
      {
        'w-12 px-0 py-3': props.label == null && props.icon !== null,
      },

      // Shapes
      { 'shadow-lg': props.raised },
      { 'rounded-md': !props.rounded, 'rounded-full': props.rounded },
      {
        'rounded-none first:rounded-l-md last:rounded-r-md': parent.instance.$name == 'InputGroup',
      },

      // Link Button
      { 'text-primary-600 bg-transparent border-transparent': props.link },

      // Plain Button
      {
        'text-white bg-gray-500 border border-gray-500':
          props.plain && !props.outlined && !props.text,
      },
      // Plain Text Button
      { 'text-surface-50': props.plain && props.text },
      // Plain Outlined Button
      {
        'text-surface-50 border border-gray-500': props.plain && props.outlined,
      },

      // Text Button
      { 'bg-transparent border-transparent': props.text && !props.plain },

      // Outlined Button
      { 'bg-transparent border': props.outlined && !props.plain },

      // --- Severity Buttons ---

      // Primary Button - Gradient
      {
        'text-white':
          !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
        'bg-gradient-to-r from-primary-500 to-primary-600':
          !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
        'hover:from-primary-400 hover:to-primary-500':
          !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
        // Remove border for gradient buttons
        'border-0':
          !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
      },

      // Secondary/Outlined Button
      {
        'bg-transparent border text-primary-400': props.severity === 'secondary' || props.outlined,
        'border-primary-500/30': props.severity === 'secondary' || props.outlined,
        'hover:border-primary-500/50': props.severity === 'secondary' || props.outlined,
      },

      // Success Button
      {
        'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-0':
          props.severity === 'success' && !props.text && !props.outlined && !props.plain,
      },

      // Info Button
      {
        'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white border-0':
          props.severity === 'info' && !props.text && !props.outlined && !props.plain,
      },

      // Warning Button
      {
        'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-0':
          props.severity === 'warn' && !props.text && !props.outlined && !props.plain,
      },

      // Danger Button
      {
        'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white border-0':
          props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
      },
      // Contrast Button
      {
        'text-white text-surface-300':
          props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
        'bg-surface-0':
          props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
        'border border-surface-0':
          props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
      },
      // Contrast Text Button
      {
        'text-surface-0': props.text && props.severity === 'contrast' && !props.plain,
      },
      // Contrast Outlined Button
      {
        'text-surface-0 border border-surface-0':
          props.outlined && props.severity === 'contrast' && !props.plain,
      },

      // --- Severity Button States ---
      'focus:outline-none focus:outline-offset-0 focus:ring',

      // Link
      { 'focus:ring-primary': props.link },

      // Plain
      {
        'hover:bg-gray-600 hover:border-gray-600': props.plain && !props.outlined && !props.text,
      },
      // Text & Outlined Button
      {
        'hover:bg-surface-300/20': props.plain && (props.text || props.outlined),
      },

      // Primary
      {
        'hover:bg-primary-emphasis hover:border-primary-emphasis':
          !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
      },
      { 'focus:ring-primary': props.severity === null },
      // Text & Outlined Button
      {
        'hover:bg-primary-300/20':
          (props.text || props.outlined) && props.severity === null && !props.plain,
      },

      // Secondary
      {
        'hover: hover:border-surface-300':
          props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-surface-300/50': props.severity === 'secondary',
      },
      // Text & Outlined Button
      {
        'hover:bg-surface-300/20':
          (props.text || props.outlined) && props.severity === 'secondary' && !props.plain,
      },

      // Success
      {
        'hover:bg-green-300 hover:border-green-300':
          props.severity === 'success' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-green-300/50': props.severity === 'success',
      },
      // Text & Outlined Button
      {
        'hover:bg-green-300/20':
          (props.text || props.outlined) && props.severity === 'success' && !props.plain,
      },

      // Info
      {
        'hover:bg-blue-300 hover:border-blue-300':
          props.severity === 'info' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-blue-300/50': props.severity === 'info',
      },
      // Text & Outlined Button
      {
        'hover:bg-blue-300/20':
          (props.text || props.outlined) && props.severity === 'info' && !props.plain,
      },

      // Warning
      {
        'hover:bg-orange-300 hover:border-orange-300':
          props.severity === 'warn' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-orange-300/50': props.severity === 'warn',
      },
      // Text & Outlined Button
      {
        'hover:bg-orange-300/20':
          (props.text || props.outlined) && props.severity === 'warn' && !props.plain,
      },

      // Help
      {
        'hover:bg-purple-300 hover:border-purple-300':
          props.severity === 'help' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-purple-300/50': props.severity === 'help',
      },
      // Text & Outlined Button
      {
        'hover:bg-purple-300/20':
          (props.text || props.outlined) && props.severity === 'help' && !props.plain,
      },

      // Danger
      {
        'hover:bg-red-300 hover:border-red-300':
          props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-red-300/50': props.severity === 'danger',
      },
      // Text & Outlined Button
      {
        'hover:bg-red-300/20':
          (props.text || props.outlined) && props.severity === 'danger' && !props.plain,
      },
      // Contrast
      {
        'hover:hover:bg-surface-600 hover:border-surface-100':
          props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
      },
      {
        'focus:ring-surface-400': props.severity === 'contrast',
      },
      // Text & Outlined Button
      {
        'hover:bg-[rgba(255,255,255,0.03)]':
          (props.text || props.outlined) && props.severity === 'contrast' && !props.plain,
      },
      // Disabled
      { 'opacity-60 pointer-events-none cursor-default': context.disabled },

      // Transitions
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer overflow-hidden select-none',

      // Badge
      '[&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
    ],
  }),
  label: ({ props }) => ({
    class: [
      'duration-200',
      'font-bold',
      {
        'hover:underline': props.link,
      },
      { 'flex-1': props.label !== null, 'invisible w-0': props.label == null },
    ],
  }),
  icon: ({ props }) => ({
    class: [
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'order-2': props.iconPos == 'bottom' && props.label != null,
      },
    ],
  }),
  loadingIcon: ({ props }) => ({
    class: [
      'h-4 w-4',
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null,
      },
      'animate-spin',
    ],
  }),
  badge: ({ props }) => ({
    class: [
      {
        'ml-2 w-4 h-4 leading-none flex items-center justify-center': props.badge,
      },
    ],
  }),
}
