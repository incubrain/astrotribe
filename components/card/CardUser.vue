<template>
  <article class="md:rounded-lg text-center flex relative flex-col md:overflow-hidden animate-swipe-in scale-x-0 origin-left border-b border-gray-200">
    <div class="bg-white w-full flex flex-col h-full p-4 md:p-6 gap-2 md:gap-4 relative">
      <div v-if="props.user" class="w-full flex items-center flex-row gap-2 md:gap-4 justify-between">
        <NuxtLink
          :to="`/profile/${props.user.id}`"
          class="group"
        >
          <div class="flex gap-2 justify-center items-center">
            <img
              :src="u.users.avatar(props.user.id, props.user.avatar)"
              class="rounded-full h-10 md:h-14 aspect-square object-cover object-top"
            />
            <div class="flex flex-col gap-2 align-start">
              <h2 class="text-sm md:text-lg text-left font-semibold group-hover:underline group-hover:underline-offset-2 text-black">{{ props.user.given_name }} {{ props.user.surname }}</h2>
              <div class="flex gap-1 w-full text-xs items-start">
                <span
                  v-if="props.user.main_role.name !== 'User'"
                  class="font-light flex justify-center text-black"
                >
                  <Icon
                    :name="u.users.roleIcon(props.user.main_role.id)"
                    class="text-green-700 mr-1"
                    size="14px"
                  />
                  {{ props.user.main_role.name }} | @{{ props.user.username }}
                </span>
                <span
                  v-else
                  class="font-light"
                >
                  @{{ props.user.username }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
        <div class="absolute top-2 right-3 flex-row align-center justify-center gap-1 text-black">
          <Icon name="mdi:account-multiple-plus" class="flex justify-end items-start w-[26px] h-[26px] hover:text-green-800 cursor-pointer" />
          <!-- <button
            v-if="!props.user.is_following"
            class="bg-[#0f1419] border rounded-full pl-2 pr-1 py-[4px] md:pl-4 md:pr-2 md:py-[8px] w-full text-xs font-semibold leading-none text-white flex gap-2 items-center hover:bg-[#3d3d3d] focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:outline-none"
          >
            Follow
            <p class="bg-[#fff] rounded-full py-[4px] px-[6px] text-xs font-semibold leading-none text-[#3d3d3d]">
              {{ props.user.follow_count ? props.user.follow_count : 0 }}
            </p>
          </button>
          <button
            v-else
            class="border rounded-full px-2 py-[4px] md:pl-4 md:pr-2 md:py-[8px] text-xs font-semibold leading-none text-[#0f1419] w-[110px] flex gap-2 items-center justify-end hover:bg-[#ffe4e4] hover:border-[#ffc6c6] hover:text-[#e16767] hover:before:content-['Unfollow'] focus:ring-2 focus:ring-offset-2 focus:outline-none before:content-['Following']"
          >
            <p class="bg-[#3b3b3b] w-auto rounded-full py-[4px] px-[6px] text-xs font-semibold leading-none text-[#d0d0d0]">
              {{ props.user.follow_count ? props.user.follow_count : 0 }}
            </p>
          </button> -->
        </div>
      </div>
      <p
        v-if="props.user.introduction"
        class="text-black text-left text-xs"
      >
        {{ props.user.introduction?.slice(0, 120) }}...
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { User } from '~~/types/index.js'

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  }
})

const u = useUtils()

// const lastSeen = u.time.lastSeen(props.user.last_seen)

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
