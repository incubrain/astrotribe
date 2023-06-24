<template>
  <article
    class="md:rounded-lg text-center flex relative flex-col md:overflow-hidden animate-swipe-in origin-left"
  >
    <div class="foreground w-full flex flex-col h-full p-4 md:p-6 gap-2 md:gap-4 relative">
      <div
        v-if="props.user"
        class="w-full flex items-center flex-row gap-2 md:gap-4 justify-between"
      >
        <NuxtLink
          :to="`/profile/${props.user.id}`"
          class="group"
        >
          <div class="flex gap-2 justify-center items-center">
            <NuxtImg
              :src="u.users.avatar(props.user.id, props.user.avatar, { width: 40, height: 40 })"
              loading="lazy"
              quality="80"
              width="40"
              height="40"
              format="webp"
              class="rounded-full object-top"
            />
            <div class="flex flex-col gap-2 align-start">
              <h2
                class="text-sm md:text-lg text-left font-semibold group-hover:underline group-hover:underline-offset-2 tracking-tighter"
              >
                {{ props.user.given_name }} {{ props.user.surname }}
              </h2>
              <div class="flex gap-1 w-full text-xs items-start">
                <span
                  v-if="props.user.main_role.name !== 'User'"
                  class="font-light flex justify-center items-center"
                >
                  <UIcon
                    :name="u.users.roleIcon(props.user.main_role.id)"
                    class="text-green-700 mr-1 w-5 h-5"
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
        <div class="absolute top-2 right-3 flex-row align-center justify-center gap-1">
          <UIcon
            v-if="props.user.is_following"
            name="i-mdi-account-multiple-check"
            class="flex justify-end items-start w-[26px] h-[26px] text-green-800 hover:text-red-800 cursor-pointer"
          />
          <UIcon
            v-else
            name="i-mdi-account-multiple-plus"
            class="flex justify-end items-start w-[26px] h-[26px] hover:text-green-800 cursor-pointer"
          />
        </div>
      </div>
      <p
        v-if="props.user.introduction"
        class="text-left text-xs"
      >
        {{ props.user.introduction?.slice(0, 120) }}...
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { UserBasic } from '@/types'

const props = defineProps({
  user: {
    type: Object as PropType<UserBasic>,
    required: true
  }
})

const u = useUtils()

// const lastSeen = u.time.lastSeen(props.user.last_seen)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
