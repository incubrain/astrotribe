<template>
  <nav
    class="flex sticky top-0 left-0 items-center md:items-stretch w-full justify-end md:justify-between foreground shadow-lg z-50 border-b border-color h-[var(--nav-height-sm)] md:h-[var(--nav-height-md)] lg:h-[var(--nav-height-lg)]"
  >
    <div
      class="grid grid-cols-[minmax(160px,1fr)_minmax(1fr,420px)_minmax(160px,220px)] gap-6 items-center w-full md:flex justify-between text-zinc-900 dark:text-zinc-100"
    >
      <!-- logo -->
      <div class="h-full flex items-center pl-3 md:pl-4 col-start-1 col-span-2 md:col-span-1">
        <NuxtLink
          to="/"
          class="nav-link flex items-center gap-2"
        >
          <div class="p-1 h-[26px] w-[26px] md:h-[40px] md:w-[40px] bg-white rounded-full overflow-hidden">
            <NuxtImg
              src="/astronera-logo.jpg"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <h1 class="text-xl md:text-2xl block font-semibold px-4 mr-4"> AstronEra </h1>
        </NuxtLink>
        <div
          class="hidden lg:flex gap-4 pl-4 justify-center border-l border-color items-center h-full leading-none text-sm font-semibold whitespace-nowrap"
        >
          <NuxtLink
            to="/users"
            class="nav-link"
          >
            AstroTribe
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="nav-link"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="nav-link"
          >
            Contact us
          </NuxtLink>
        </div>
      </div>
      <div class="col-start-3 col-span-1 pr-3 md:pr-6 flex w-full relative">
        <div class="flex gap-4 w-full items-center justify-end">
          <ThemeToggle />
          <div>
            <UButton color="primary"> Join Free </UButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()

if (error) throw new Error('error getting user session')
</script>
