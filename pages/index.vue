<template>
  <div>
    <AppThemeSwitch />
  </div>
</template>

<script setup>

const colorMode = useColorMode()
console.log(colorMode.preference)
</script>

<style>
:root {
  --toggle-size: 10rem;
  --switch-w: 4em;
  --switch-h: 2em;
  --switch-handle-scale: .65;
  --switch-off-handle-x: -.125em;
  --switch-on-handle-x: calc(100% - .125em);
  --switch-transition-duration: .2s;
}

#theme-toggle label {
  font-size: var(--toggle-size);
  display: flex;
  height: var(--switch-h);
  width: var(--switch-w);
  border-radius: calc(var(--switch-h) / 2);
  background-size: auto 8em;
  background-position: bottom;
  background-image: linear-gradient(180deg, #021037 0%, #20206A 19%, #4184B1 66%, #62E7F7 100%);
  transition: var(--switch-transition-duration);
  border: .125em solid hsl(207, 30%, 95%);
  overflow: hidden;

}

#theme-toggle span {
  background: #fffad8;
  border-radius: 50%;
  height: var(--switch-h);
  width: var(--switch-h);
  transform: translateX(var(--switch-off-handle-x)) scale(var(--switch-handle-scale));
  transition: var(--switch-transition-duration);
  cursor: pointer;
  box-shadow: 0 0 .25em .0625em #fbee8d, 0 0 2em 0 #FFEB3B, inset -.25em -.25em 0 0 #fbee8e, inset -.3125em -.3125em 0 .625em #fff5b2;
  margin-top: var(--switch-off-handle-x);
}

#theme-toggle:checked {
  font-size: var(--switch-font-size);

}

#theme-toggle label {
  background-position: top;
  border-color: hsl(207, 30%, 50%);
}

#theme-toggle span {
  background: transparent;
  transform: translateX(var(--switch-on-handle-x)) scale(var(--switch-handle-scale));
  box-shadow: inset -.1875em -.1875em 0 0 #fbe7ef, inset -.5625em -.5625em 0 0 #fffff7;
}

#theme-toggle {
  display: none;
}



/* end  */
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}

.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}

.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}

html {
  font-size: 20px;
}

body {
  font-family: sans-serif;
  margin: 1rem;
}

.container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1rem;
  max-width: 1440px;
  margin: 0 auto;
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile:nth-child(1) {
  grid-column: span 4;
  grid-row: span 2;
}

.tile:nth-child(2),
.tile:nth-child(3) {
  grid-column: span 2;
}

.tile:nth-child(4),
.tile:nth-child(5) {
  grid-column: span 3;
}

@media screen and (max-width: 650px) {
  .container {
    display: block;
  }

  .tile {
    margin-bottom: 1rem;
  }
}
</style>
