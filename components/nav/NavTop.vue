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
    class="flex min-w-full"
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
      class="w-full rounded-none backdrop:blur-lg lg:rounded-b-md"
      :pt="{
        submenu: {
          class: '!text-sm !font-bold'
        }
      }"
      :ptOptions="{ mergeSections: true, mergeProps: true }"
    >
      <template #start>
        <div class="hidden gap-4 rounded-md p-1 lg:flex">
          <div
            class="relative flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-md border bg-white p-1 md:h-[44px] md:w-[44px]"
          >
            <BaseImage
              :img="{
                src: '/astronera-logo.jpg'
              }"
              class="h-full w-full dark:opacity-90"
            />
          </div>
          <NuxtLink
            to="/"
            class="flex min-h-full items-center justify-center"
          >
            <h1
              class="mt-[2px] flex cursor-pointer flex-col items-start justify-start pr-2 text-sm font-bold uppercase leading-none tracking-normal"
            >
              Astron
              <strong class="font-extrabold text-primary-600 dark:text-primary-700"> Era </strong>
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
        <div class="flex flex-nowrap items-center justify-center gap-4 lg:pr-2">
          <NuxtLink
            to="https://github.com/incubrain/astrotribe"
            target="_blank"
            class="hidden items-center justify-center lg:flex"
          >
            <Icon
              name="mdi:github"
              class="flex h-5 w-5 cursor-pointer items-center justify-center md:h-6 md:w-6"
            />
          </NuxtLink>
          <ClientOnly>
            <div class="flex h-auto min-w-24 items-center justify-center gap-2 lg:gap-4">
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
                    severity="contrast"
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
  animation: bounce-in 0.5s ease-out forwards;
}

.animate-bounce-out {
  animation: bounce-out 1s ease-in forwards;
}
</style>
