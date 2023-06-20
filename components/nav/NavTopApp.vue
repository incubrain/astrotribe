<template>
  <!-- Navigation starts -->
  <nav
    class="flex items-center md:items-stretch w-full h-[60px] justify-end md:justify-between foreground relative shadow-xl z-50 border-b border-color"
  >
    <div
      class="grid grid-cols-[minmax(160px,1fr)_minmax(1fr,420px)_minmax(160px,220px)] gap-6 items-center w-full md:flex justify-between text-zinc-900 dark:text-zinc-100"
    >
      <!-- logo -->
      <div class="h-full flex items-center pl-3 md:pl-4 col-start-1 col-span-2 md:col-span-1">
        <div class="p-1 rounded-full h-[40px] w-[40px] overflow-hidden">
          <img
            src="/astronera-logo.jpg"
            class="w-full h-full"
          />
        </div>
        <h1 class="text-xl md:text-2xl block font-semibold px-4 mr-4"> AstronEra </h1>
        <div
          v-show="route.path === '/'"
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
      <AppTabs class="hidden h-full md:flex" />
      <div class="col-start-3 col-span-1 pr-3 md:pr-6 flex w-full relative">
        <div
          v-show="route.path !== '/'"
          class="w-full flex items-center justify-end"
        >
          <NuxtLink to="/profile/1">
            <div class="flex items-center relative cursor-pointer">
              <p class="text-gray-800 hidden md:flex text-sm mx-3">
                {{ currentSession ? 'Authenticated' : 'Anon.' }}
              </p>
              <div class="rounded-full">
                <div class="relative">
                  <NuxtImg
                    class="rounded-full h-[32px] w-[32px] md:h-[40px] md:w-[40px] object-cover"
                    :src="
                      s.image.optimized({
                        bucket: 'profile-public',
                        folderPath: `${user.id}/avatar`,
                        file: user.avatar,
                        isPrivate: false,
                        transform: { width: 80, height: 80, fit: 'cover', quality: 75 }
                      })
                    "
                    :alt="`${user.given_name} AstroTribe avatar`"
                  />
                  <div
                    class="w-2 h-2 rounded-full bg-green-400 border border-color absolute inset-0 mb-0 mr-0 m-auto"
                  />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div class="flex gap-4 w-full items-center justify-end">
          <ThemeToggle />
          <div v-show="route.path === '/'">
            <UButton color="primary"> Join Free </UButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const s = useStorage()

const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()

if (error) throw new Error('error getting user session')
</script>
