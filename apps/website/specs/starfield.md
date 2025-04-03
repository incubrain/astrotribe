```ts
const { stars, isClient } = useStarfield(40, 5) // starCount, shootingStarCount

```

```html
<template>

    <div
        v-if="isClient"
        class="absolute inset-0 pointer-events-none"
    >
        <div
            v-for="star in stars"
            :key="star.id"
            class="absolute rounded-full bg-white"
            :style="star.style"
        ></div>
    </div>

</template>
```