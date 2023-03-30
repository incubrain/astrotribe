<template>
    <div>
        <div>
            <span class="flex gap-1 justify-center items-center"> {{ userRole.role }} 
                <Icon :name=" userRole.icon" size="26px" class="text-yellow-400 ml-2" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">

interface Role {
    role: string;
    icon: string;
}

defineProps({
    userRole: {
      type: Object as PropType<Role>,
      required: true,
    },
})

</script>

<style scoped>

</style>