<template>
  <div class="w-full h-full">
    <NavTop />
    <AppBody>
      <div class="grid lg:grid-cols-[500px_1fr] foreground h-full">
        <div
          class="col-start-1 px-8 h-full w-full flex flex-col justify-center items-center relative z-20 border-r-2 border-color shadow-xl"
        >
          <slot />
        </div>
        <div
          v-if="data"
          class="h-full hidden lg:flex relative col-start-2 overflow-hidden"
        >
          <div class="dark:bg-black/30 absolute w-full h-full left-0 top-0" />
          <NuxtImg
            v-if="!imageLoaded"
            ref="blur"
            :src="data.url"
            quality="20"
            width="150"
            height="120"
            alt=""
            class="w-full object-cover object-center"
          />
          <NuxtImg
            v-else
            :src="data.url"
            quality="95"
            alt=""
            class="w-full object-cover object-center"
            @load="imageLoaded = true"
          />
          <div
            class="group bg-[#00000040] text-white p-6 rounded-lg shadow-lg absolute top-2 lg:left-2 w-[90%] max-w-[420px] transition-all duration-300 backdrop-blur-md"
          >
            <h1 class="text-xl font-semibold pb-2">
              {{ data.title }}
            </h1>
            <p
              class="h-[0px] xl:h-[100px] overflow-auto group-hover:h-[48vh] transition-all duration-300 scrollbar-hidden"
            >
              {{ data.explanation }}
            </p>
            <div class="flex flex-row gap-2 pt-2 items-center">
              <p class="text-sm font-bold">
                {{ data.date }}
              </p>
              <p class="text-xs"> Copyright: {{ data.copyright }} </p>
            </div>
          </div>
        </div>
      </div>
    </AppBody>
  </div>
</template>

<script setup lang="ts">
const { event } = useEventHandler()

const imageLoaded = ref(false)

event.auth

const { data, error } = await useFetch('/api/iotd')

console.log('spazz', data.value, error)
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
