<template>
    <div>
        <div>
            <span class="flex gap-1 justify-center items-center"> {{ role }} 
                <Icon name="ic:baseline-menu-book" size="26px" class="text-yellow-400 ml-2" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    role: {
        type: String as PropType<string>,
        required: true,
    },
})

</script>

<style scoped>

</style>