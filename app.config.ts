// This supports HMR
export default defineAppConfig({
  title: 'AstronEra - AstroTribe',
  ui: {
    primary: 'cyan',
    tooltip: {
      background: 'bg-zinc-100 dark:bg-neutral-950',
      base: 'invisible lg:visible h-auto px-3 py-2 text-sm font-normal truncat'
    },
    modal: {
      padding: 'lg:p-4',
      width: 'w-full lg:max-w-[80%] xl:max-w-[80%]',
      height: 'h-full',
      container: 'flex h-full items-center justify-center text-center',
      rounded: 'lg:rounded-lg'
    },
    slideover: {
      background: 'bg-zinc-100 dark:bg-neutral-950'
    },
    popover: {
      width: 'w-full lg:max-w-[80%] xl:max-w-[80%]',
      wrapper: 'relative p-4 xl:p-8'
    },
    dropdown: {
      background: 'bg-zinc-100 dark:bg-neutral-950',
      border: 'border-zinc-200 dark:border-zinc-800',
      item: {
        active: 'bg-zinc-50 dark:bg-zinc-900'
      }
    },
    table: {
      thead: 'bg-zinc-50 dark:bg-zinc-900 sticky top-0',
      td: {
        base: 'max-w-[160px] overflow-hidden'
      },
      tr: {
        base: 'hover:bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800'
      }
    },
    card: {
      background: 'bg-zinc-50 dark:bg-zinc-900'
    },
    alert: {
      description: 'mt-2 text-sm leading-normal opacity-90'
    }
  }
})
