<template>
    <button @click="change(!visible)" class="absolute bg-black text-white top-10 z-30">toggle</button>
    <ProfileUser v-if="visible"/>
    <ProfileMentor v-else />
</template>

<script setup lang="ts">

let visible = ref(true)

function change(v) {
    visible.value = v
    console.log('change', visible)
}

definePageMeta({
    name: 'Profile',
    layout: 'no-spacing',
})

</script>
