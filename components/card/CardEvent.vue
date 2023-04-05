<template>
  <div class="py-4 m-0 relative bg-white rounded-lg overflow-hidden flex flex-col justify-start animate-swipe-in scale-x-0 origin-left">
    <div class="user-block">
      <section
        v-for="(host, idx) in props.event.hosts"
        :key="host.id"
        class="user-avatars text-black"
      >
        <div :class="idx > 0 ? 'photo ml-[-20px] border-4 border-white' : 'photo border-4 border-white relative z-10'">
          <img :src="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/${host.id}/avatar/${host.avatar}`" />
        </div>
      </section>
      <section class="user-info pl-2">
        <h3>
          <span
            v-for="(host, index) in props.event.hosts"
            :key="host.id"
          >
            <NuxtLink :to="`/profile/${host.id}`">
              <span> {{ host.given_name }} </span>
              <span
                v-if="index !== (props.event.hosts.length - 1)"
              >, </span>
            </NuxtLink>
          </span>
          <em class="pl-2">hosting</em>
        </h3>
        <span
          v-if="time"
          class="date"
        >
          {{ time.day }} {{ time.month }}, {{ time.time }} {{ time.ampm }}
        </span>
      </section>
    </div>
    <NuxtLink :to="`/venues/${props.event.venue.id}`">
      <div class="pb-4 pl-4 text-xs flex items-center gap-4 text-gray-500">
        <div class="pl-2">
          <Icon
            name="uil:location-point"
            size="20px"
          />
        </div>
        <div class="flex flex-col">
          <h3>{{ props.event.venue.name }}</h3>
          <p>
            {{ props.event.venue.location.country }}, {{ props.event.venue.location.state }},
            {{ props.event.venue.location.city }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <article>
      <figure>
        <img src="/cover1.jpg" />
      </figure>
      <NuxtLink :to="`/events/${props.event.id}`">
        <section class="article-info">
          <div class="date flex-col justify-center items-center">
            <span class="day">{{ time.month }}</span>
            <span class="month text-center">{{ time.day }}</span>
          </div>
          <h2>{{ props.event.title }}</h2>
          <span class="text-sm text-black font-thin"> {{ props.event.body }}</span>
        </section>
      </NuxtLink>
      <!-- <div
                class="flex flex-wrap gap-4 justify-left items-center text-black p-6"
            >
                <ul class="flex flex-row">
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                </ul>
                <span>+ 146 going</span>
            </div> -->
    </article>
    <!-- <div class="flex flex-row justify-end items-center w-full h-[40px] text-black px-4 gap-4">
            <div class="flex flex-row gap-2 justify-center items-center">
                <span class="leading-none">847</span>
                <Icon name="bx:upvote" size="24px"/>
            </div>
            <div class="flex flex-row justify-center gap-2 items-center">
                <span class="leading-none">37</span>
                <Icon name="ion:share-social-outline" size="24px"/>
            </div>
            <button class="bg-gray-100 h-full w-1/2 rounded-lg">rsvp</button>
        </div> -->
  </div>
</template>

<script setup lang="ts">
import type { ATEvent } from '@/types/types'

const props = defineProps({
  event: {
    type: Object as PropType<ATEvent>,
    required: true
  }
})

const h = useUtils()
const time = h.time.format(props.event.date)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.user-block {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
}

.user-block .photo {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 100%;
}

.user-block .photo img {
  width: 100%;
}

.user-block .user-info h3 {
  margin: 0 0 2px 0;
  font-size: 16px;
  color: #162b39;
  font-weight: 700;
}

.user-block .user-info h3 em {
  color: #8492a6;
  font-style: normal;
}

.user-block .user-info .date {
  display: block;
  color: #8492a6;
  font-weight: 400;
  font-size: 13px;
}

article figure {
  margin: 0;
}

article figure img {
  width: 100%;
}

article .article-info {
  position: relative;
  padding: 30px 15px 15px 15px;
}

article .article-info .date {
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 10px 20px 0 rgba(0, 10, 14, 0.1);
  padding: 10px 15px;
  position: absolute;
  left: 15px;
  top: -40px;
}

article .article-info .date .day {
  display: block;
  color: #162b39;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  margin-bottom: 2px;
}

article .article-info .date .month {
  display: block;
  color: #d73601;
  font-weight: 700;
  font-size: 14px;
}

article .article-info h2 {
  margin: 0 0 3px 0;
  color: #162b39;
  font-weight: 700;
  font-size: 18px;
}

.reaction:first-child {
  margin-right: 30px;
}

.reaction span {
  font-size: 13px;
  font-weight: 400;
  display: inline-block;
  margin-left: 7px;
}

.reaction button svg {
  vertical-align: middle;
  width: 26px;
  transition: all 0.3s ease-in-out;
}
.reaction.comment button svg {
  fill: #c46fcc;
}

.share button svg {
  vertical-align: middle;
  width: 26px;
  fill: #8492a6;
  transition: all 0.3s ease-in-out;
}
</style>
