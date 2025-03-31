export {}

declare global {
  interface Window {
    turnstile: {
      render: (selector: string, options: any) => string | null
      reset: (widgetId: string | null) => void
      remove: (widgetId: string | null) => void
    }
  }
}
