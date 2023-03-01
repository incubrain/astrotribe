<template>
    <div
        class="min-h-full grid 
            grid-cols-[minmax(160px,1fr)]
            md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
            2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
            rounded-md shadow-sm gap-6
        ">
        <CardUser2
            v-for="user in s.users"
            :key="user.id"
            :user="user"
        />
        <div class="md:col-span-2">
            <h1 class="text-xl text-black pb-4"> User</h1>
            <p> {{ s.users }}</p>
            <h1 class="text-xl text-black pb-4"> Followers </h1>
            <p> {{ s.followers }}</p>
            <h1 class="text-xl text-black pb-4"> Followed</h1>
            <p> {{ s.followed }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'All' })

const u = useUsersStore()
await u.getUsers()
// await u.getUserFollowers({ userId: 1 })
// await u.getUserFollowed({ userId: 1 })

const s = appState()

console.log('users', u.users)

</script>
