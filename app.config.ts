// This supports HMR
export default defineAppConfig({
  title: 'AstronEra - AstroTribe',
  ui: {
    primary: 'cyan',
    tooltip: {
      background: 'background',
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
      background: 'background'
    },
    dropdown: {
      background: 'background',
      border: 'border-color',
      item: {
        active: 'foreground'
      }
    },
    table: {
      thead: 'foreground sticky top-0',
      td: {
        base: 'max-w-[160px] overflow-hidden'
      },
      tr: {
        base: 'hover:foreground border-b border-color'
      }
    }
  }
})
