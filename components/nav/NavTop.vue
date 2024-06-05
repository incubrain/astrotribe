<script setup lang="ts">
const { websiteLinks } = usePages()

const props = defineProps({
  isCompact: {
    type: Boolean,
    default: false
  },
  compactOnScroll: {
    type: Boolean,
    default: false
  }
})

const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)

const { y } = useWindowScroll()
const lastScrollY = ref(y.value)
const navbarClasses = computed(() => {
  if (navPosition.value === 'fixed') {
    return ''
  } else {
    return navPosition.value === 'hidden' ? 'animate-bounce-out' : 'animate-bounce-in'
  }
})

const navPosition = ref('fixed')
const userSession = computed(() => haveUserSession.value ?? false)

watch(
  y,
  (newY) => {
    if (window?.innerWidth < 1024) {
      navPosition.value = 'fixed'
    } else if (newY > lastScrollY.value) {
      navPosition.value = 'hidden'
    } else if (newY < lastScrollY.value) {
      navPosition.value = 'visible'
    }
    lastScrollY.value = newY
  },
  { immediate: true }
)
</script>

<template>
  <div
    ref="navbar"
    class="flex w-full wrapper lg:justify-center lg:items-center lg:padded-x"
    :class="navbarClasses"
    :style="{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '50'
    }"
  >
    <PrimeMenubar
      :model="websiteLinks"
      class="rounded-none lg:rounded-b-md w-full backdrop-white/20 backdrop:blur-lg"
      :pt="{
        submenu: 'text-sm font-semibold max-w-xl w-[220px]'
      }"
    >
      <template #start>
        <div class="gap-4 hidden lg:flex rounded-md p-1">
          <div
            class="p-1 h-[36px] w-[36px] md:h-[44px] md:w-[44px] bg-white rounded-md overflow-hidden relative flex justify-center items-center border"
          >
            <BaseImage
              :img="{
                src: '/astronera-logo.jpg'
              }"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <NuxtLink
            to="/"
            class="flex items-center justify-center min-h-full"
          >
            <h1
              class="pr-2 uppercase text-sm font-bold cursor-pointer flex tracking-normal justify-start items-start mt-[2px] leading-none flex-col"
            >
              Astron
              <strong class="text-primary-600 dark:text-primary-700 font-extrabold"> Era </strong>
            </h1>
          </NuxtLink>
        </div>
      </template>
      <template #item="{ item, hasSubmenu, root }">
        <div class="px-4 py-2">
          <NuxtLink
            v-ripple
            :to="item.url"
            class="cursor-pointer"
          >
            <p class="flex items-center gap-1">
              {{ item.label }}
              <Icon
                v-if="hasSubmenu"
                :name="root ? 'mdi:chevron-down' : 'mdi:chevron-right'"
              />
            </p>
          </NuxtLink>
        </div>
      </template>
      <template #end>
        <div class="flex items-center justify-center gap-4 flex-nowrap lg:pr-2">
          <NuxtLink
            to="https://github.com/incubrain/astrotribe"
            target="_blank"
            class="justify-center items-center hidden lg:flex"
          >
            <Icon
              name="mdi:github"
              class="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex justify-center items-center"
            />
          </NuxtLink>
          <ClientOnly>
            <div class="gap-2 lg:gap-4 flex items-center justify-center h-auto min-w-24">
              <div
                v-if="userSession"
                class="flex gap-2 lg:gap-4"
              >
                <AuthVerifiedWith />
              </div>
              <div
                v-else
                class="space-x-2 lg:space-x-4"
              >
                <NuxtLink
                  v-ripple
                  to="/auth/login"
                >
                  <PrimeButton
                    severity="secondary"
                    outlined
                    @click="$posthog()?.capture('login_app', { location: 'top_nav' })"
                  >
                    login
                  </PrimeButton>
                </NuxtLink>

                <NuxtLink
                  v-ripple
                  to="/auth/register"
                >
                  <PrimeButton
                    @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
                  >
                    Join AstronEra
                  </PrimeButton>
                </NuxtLink>
              </div>
            </div>
          </ClientOnly>
        </div>
      </template>
    </PrimeMenubar>
  </div>
</template>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounce-out {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.7s ease-out forwards;
}

.animate-bounce-out {
  animation: bounce-out 0.7s ease-in forwards;
}
</style>
