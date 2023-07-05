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
      width: 'max-w-[90%] md:max-w-[80%] lg:max-w-[80%] w-auto xl:max-w-[80%]',
      container: 'flex min-h-full items-center justify-center text-center'
    },
    slideover: {
      background: 'background',
    }
  }
})
