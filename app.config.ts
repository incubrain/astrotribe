// This supports HMR
export default defineAppConfig({
  title: 'AstronEra - AstroTribe',
  ui: {
    primary: 'cyan',
    tooltip: {
      background: 'bg-gray-50 dark:bg-neutral-950',
      base: 'invisible lg:visible h-auto px-3 py-2 text-sm font-normal truncat'
    },
    modal: {
      padding: 'lg:p-4',
      width: 'w-full lg:max-w-[80%] xl:max-w-[80%]',
      container: 'flex h-full items-center justify-center text-center',
      rounded: 'lg:rounded-lg'
    },
    slideover: {
      background: 'bg-gray-50 dark:bg-neutral-950'
    },
    popover: {
      width: 'w-full lg:max-w-[80%] xl:max-w-[80%]',
      wrapper: 'relative p-4 xl:p-8'
    },
    dropdown: {
      background: 'bg-gray-50 dark:bg-neutral-950',
      border: 'border-zinc-200 dark:border-zinc-800',
      item: {
        active: 'bg-white dark:bg-black'
      }
    },
    table: {
      thead: 'bg-white dark:bg-black sticky top-0',
      td: {
        base: 'max-w-[160px] overflow-hidden'
      },
      tr: {
        base: 'hover:bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800'
      }
    },
    card: {
      background: 'bg-white dark:bg-black'
    },
    alert: {
      description: 'mt-2 text-sm leading-normal opacity-90'
    }
  }
})
