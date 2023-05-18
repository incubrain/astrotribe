<template>
  <!-- Navigation starts -->
  <nav class="flex items-center md:items-stretch w-full justify-end md:justify-between bg-white shadow relative z-[0]">
    <div class="grid grid-cols-[minmax(160px,1fr)_minmax(1fr,420px)_minmax(160px,220px)] gap-6 items-center w-full md:flex justify-between text-black">
      <!-- logo -->
      <div class="h-full flex items-center pl-3 md:pl-4 col-start-1 col-span-2 md:col-span-1">
        <h1 class="text-xl md:text-2xl block font-semibold px-4 mr-4"> AstronEra </h1>
        <div v-show="route.path === '/'" class="hidden lg:flex gap-4 pl-4 justify-center border-l items-center h-full leading-none text-sm font-semibold whitespace-nowrap">
          <NuxtLink to="/users" class="hover:text-[#471bc9]">
            AstroTribe
          </NuxtLink>
          <NuxtLink to="/about" class="hover:text-[#471bc9]">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="hover:text-[#471bc9]">
            Contact us
          </NuxtLink>
        </div>
      </div>
      <AppTabs class="hidden h-full md:flex" />
      <div class="col-start-3 col-span-1 pr-3 md:pr-6 flex w-full relative">
        <div v-show="route.path !== '/'" class="w-full flex items-center justify-end">
          <NuxtLink to="/profile/1">
            <div class="flex items-center relative cursor-pointer">
              <p class="text-gray-800 hidden md:flex text-sm mx-3">
                {{ currentSession ? 'Authenticated' : 'Anon.' }}
              </p>
              <div class="rounded-full">
                <div class="relative">
                  <img class="rounded-full h-[32px] w-[32px] md:h-[40px] md:w-[40px] object-cover" src="/avatar.png" alt="avatar" />
                  <div class="w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto"></div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-show="route.path === '/'" class="w-full flex items-end justify-end">
          <v-btn color="primary">
            Join Free
          </v-btn>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>

const route = useRoute()

const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()

if (error) throw new Error('error getting user session')

console.log('currentSession', session, currentSession, error)
</script>
