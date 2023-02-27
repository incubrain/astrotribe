<template>
    <div class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
        2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        rounded-md shadow-sm gap-6
    ">
        <CardUser2
            v-for="user in u.users"
            :key="user.id"
            :name="`${user.given_name} ${user.surname}`"
            :username="user.username"
        />
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'All' })

const u = useUsersStore()

await u.getUsers()

console.log('users', u.users)

</script>