<template>
  <article class="rounded-lg p-1 text-center flex relative flex-col overflow-hidden animate-swipe-in scale-x-0 origin-left">
    <div class="bg-white w-full flex flex-col rounded-lg h-full p-6 gap-4">
      <div v-if="props.user" class="w-full flex items-center flex-row gap-4 justify-between">
        <NuxtLink
          :to="`/profile/${props.user.id}`"
          class="group"
        >
          <div class="flex gap-2 justify-center items-center">
            <img
              :src="u.users.avatar(props.user.id, props.user.avatar)"
              class="rounded-full h-16 aspect-square object-cover object-top"
            />
            <div class="flex flex-col gap-2 align-start">
              <h2 class="text-lg font-semibold group-hover:underline group-hover:underline-offset-2 text-black">{{ props.user.given_name }} {{ props.user.surname }}</h2>
              <div class="flex gap-1 w-full text-xs items-center">
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
        <div class="flex flex-row align-center justify-center gap-1">
          <button
            v-if="!props.user.is_following"
            class="bg-[#0f1419] border rounded-full pl-4 pr-2 py-[8px] w-full text-xs font-semibold leading-none text-white flex gap-2 items-center hover:bg-[#3d3d3d] focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:outline-none"
          >
            Follow
            <p class="bg-[#fff] rounded-full py-[4px] px-[6px] text-xs font-semibold leading-none text-[#3d3d3d]">
              {{ props.user.follow_count ? props.user.follow_count : 0 }}
            </p>
          </button>
          <button
            v-else
            class="border rounded-full px-4 py-[8px] text-xs font-semibold leading-none text-[#0f1419] w-[110px] flex gap-2 items-center justify-end hover:bg-[#ffe4e4] hover:border-[#ffc6c6] hover:text-[#e16767] hover:before:content-['Unfollow'] focus:ring-2 focus:ring-offset-2 focus:outline-none before:content-['Following']"
          >
            <p class="bg-[#fff] rounded-full py-[4px] px-[6px] text-xs font-semibold leading-none text-[#3d3d3d] w-full">
              {{ props.user.follow_count ? props.user.follow_count : 0 }}
            </p>
          </button>
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
import type { User } from '@/types/types'

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
