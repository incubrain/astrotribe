<template>
  <nav
    class="flex sticky top-0 left-0 items-center md:items-stretch w-full justify-end md:justify-between foreground shadow-lg z-50 border-b border-color h-[var(--nav-height-sm)] md:h-[var(--nav-height-md)] lg:h-[var(--nav-height-lg)]"
  >
    <div
      class="grid grid-cols-[minmax(160px,1fr)_minmax(1fr,420px)_minmax(160px,220px)] gap-6 items-center w-full md:flex justify-between text-zinc-900 dark:text-zinc-100"
    >
      <NavMobiSlideover :links="links" class="lg:hidden pl-3 md:pl-4 flex items-center" />
      <div
        class="lg:flex hidden items-center h-full col-span-2 col-start-1 pl-3 md:pl-4 md:col-span-1"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2 nav-link"
        >
          <div
            class="p-1 h-[26px] w-[26px] md:h-[34px] md:w-[34px] bg-white rounded-full overflow-hidden"
          >
            <NuxtImg
              src="/astronera-logo.jpg"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <h1 class="blockpx-4 mr-4 text-xl font-semibold md:text-2xl">
            AstronEra
          </h1>
        </NuxtLink>
        <div
          class="items-center justify-center hidden h-full gap-4 pl-4 text-sm font-semibold leading-none border-l lg:flex border-color whitespace-nowrap"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.id"
            :to="link.slug"
            class="nav-link"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="relative flex w-full col-span-1 col-start-3 pr-3 md:pr-6">
        <div class="flex items-center justify-end w-full gap-4">
          <ThemeToggle />
          <NuxtLink to="/auth/register-interest">
            <UButton color="primary">
              Join Free
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import links from './routes/website.json'

const { logout, session } = useAuth()

const error = ref(null)
const currentSession = ref(null)

onMounted(async () => {
  const sessionData = await session.getCurrent()
  error.value = sessionData.error
  currentSession.value = sessionData.session

  if (error.value) throw new Error('error getting user session')
})
</script>
