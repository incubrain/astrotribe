<template>
  <!-- Navigation starts -->
  <nav
    class="flex items-center md:items-stretch w-full justify-end md:justify-between bg-white shadow relative z-0"
  >
    <div
      class="md:grid md:grid-cols-[minmax(160px,220px)_minmax(1fr,420px)_minmax(160px,220px)] w-full gap-6 items-center flex space-between text-black"
    >
      <!-- logo -->
      <div class="h-full flex items-center pl-3 md:pl-4">
        <h1 class="text-xl md:text-2xl block font-semibold pr-4">AstroTribe</h1>
        <div
          v-show="route.path === '/'"
          class="hidden lg:flex gap-4 pl-4 justify-center border-l items-center h-full leading-none text-sm font-semibold"
        >
          <NuxtLink
            to="/news"
            class="hover:text-[#471bc9]"
          >
            News
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="hover:text-[#471bc9]"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="hover:text-[#471bc9]"
          >
            Contact us
          </NuxtLink>
        </div>
      </div>
      <!-- tabs -->
      <AppTabs class="hidden h-full md:flex" />
      <div
        class="md:col-start-3 md:col-span-1 pr-3 md:pr-6 flex w-full relative"
      >
        <div class="w-full flex items-center justify-end">
          <!-- avatar dropdown -->
          <NuxtLink to="/profile/1">
            <div class="flex items-center relative cursor-pointer">
              <p class="text-gray-800 hidden md:flex text-sm mx-3">{{
                currentSession ? 'Authenticated' : 'Anon.'
              }}</p>

              <div class="rounded-md">
                <div class="relative">
                  <img
                    class="rounded-full h-[32px] mw-[32px] md:h-[40px] md:w-[40px] object-cover"
                    src="/avatar.png"
                    alt="avatar"
                  />
                  <div
                    class="w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto"
                  ></div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()

if (error) throw createError('error getting user session')

console.log('currentSession', session, currentSession, error)

function dropdownHandler(event) {
  const single = event.currentTarget.getElementsByTagName('ul')[0]
  single.classList.toggle('hidden')
}
</script>
