<template>
    <div class="flex items-center justify-center px-4 lg:px-0 py-12">
        
    </div>
</template>

<script setup>

function onEvent() {
    const Alert = document.getElementById('alert')
    Alert.style.transform = 'translateY(-200%)'
    setTimeout(function () {
        Alert.style.transform = 'translateY(0%)'
    }, 1000)
}


function closeAlert() {
    const Alert = document.getElementById('alert')
    Alert.style.transform = 'translateY(-200%)'
    onEvent()
}
</script>
