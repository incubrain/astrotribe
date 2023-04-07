<template>
  <div
    class="bg-gray-200 text-white flex flex-col w-full h-[100vh] justify-center items-center
        overflow-hidden scrollbar-hidden"
    :style="{
      backgroundImage: `url(${data.nasaImg.hdurl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div
      class="absolute top-10 right-10 cursor-pointer p-6 rounded-full bg-[#00000040] backdrop-blur-md"
      @click="isVisible = !isVisible"
    >
      <Icon name="ic:baseline-remove-red-eye" size="23px" />
    </div>
    <div
      v-show="isVisible"
      class="max-w-[780px] h-[80vh] flex flex-col justify-center items-center overflow-hidden"
    >
      <nav
        class="w-full h-[80px] flex justify-between items-center text-black text-sm font-semibold"
      >
        <NuxtLink
          to="/auth/login"
          class="text-[#fff] h-full w-full flex justify-center items-center rounded-t-lg"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class=" text-[#fff] h-full w-full flex justify-center items-center rounded-t-lg"
        >
          Register
        </NuxtLink>
      </nav>
      <slot class="animate-swipe-in scale-x-0 origin-left overflow-hidden" />
    </div>
    <div
      class="group bg-[#000000d8]  lg:bg-[#00000040] p-6 rounded-lg shadow-lg absolute top-2 lg:left-2 w-[90%] max-w-[420px]
            transition-all duration-300 backdrop-blur-md"
    >
      <h1 class="text-xl font-semibold pb-2">
        {{ data.nasaImg.title }}
      </h1>
      <p
        class="h-[0px] lg:h-[100px] overflow-auto group-hover:h-[48vh] transition-all duration-300 scrollbar-hidden"
      >
        {{ data.nasaImg.explanation }}
      </p>
      <div class="flex flex-row gap-2 pt-2 items-center">
        <p class="text-sm font-bold">
          {{ data.nasaImg.date }}
        </p>
        <p class="text-xs">
          Copyright: {{ data.nasaImg.copyright }}
        </p>
      </div>
    </div>
    <!-- <NuxtErrorBoundary @error="someErrorLogger">
            You use the default slot to render your content
            <template #error="{ error }">
                You can display the error locally here.
                <button @click="error = null">
                    This will clear the error.
                </button>
            </template>
        </NuxtErrorBoundary> -->
    <!-- <button @click="ce" class="p-14 bg-red-100">testing</button> -->
  </div>
</template>

<script setup lang="ts">

const isVisible = ref(true)

const { event } = useEventHandler()
event.auth

const { data, error } = await useFetch('/api/iotd')

console.log('spazz', data, error)
</script>

<style>
/*
Layout transition animation
https://nuxt.com/docs/getting-started/transitions
*/
.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
}

/* exact link will show the primary color for only the exact matching link */
.router-link-exact-active {
    background: #EDF1FE;
    font-weight: bold;
    color: #000;
}
</style>
