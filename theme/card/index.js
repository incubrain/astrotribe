export default {
  root: {
    class: [
      // Shape
      'rounded-md',
      'shadow-md',

      // Color
      'background',
      'text-surface-50',
    ],
  },
  body: {
    class: 'p-5',
  },
  title: {
    class: 'text-2xl font-bold mb-2',
  },
  subtitle: {
    class: [
      // Font
      'font-normal',

      // Spacing
      'mb-2',

      // Color
      'text-surface-0/60',
    ],
  },
  content: {
    class: '', // Vertical padding.
  },
  footer: {
    class: 'pt-5', // Top padding.
  },
}
