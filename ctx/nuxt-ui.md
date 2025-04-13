Nuxt UI v3.0 is a new major version rebuilt from the ground up, introducing a modern architecture
with significant performance improvements and an enhanced developer experience. This major release
includes several breaking changes alongside powerful new features and capabilities:

Tailwind CSS v4: Migration from JavaScript to CSS-based configuration Reka UI: Replacing Headless UI
as the underlying component library Tailwind Variants: New styling API for component variants This
guide provides step by step instructions to migrate your application from v2 to v3.

Migrate your project Update Tailwind CSS Tailwind CSS v4 introduces significant changes to its
configuration approach. The official Tailwind upgrade tool will help automate most of the migration
process.

For a detailed walkthrough of all changes, refer to the official Tailwind CSS v4 upgrade guide.
Create a main.css file and import it in your nuxt.config.ts file:

app/assets/css/main.css

nuxt.config.ts

@import "tailwindcss"; Run the Tailwind CSS upgrade tool:

npx @tailwindcss/upgrade Update Nuxt UI Install the latest version of the package:

pnpm

yarn

npm

bun

pnpm add @nuxt/ui Import it in your CSS: app/assets/css/main.css

@import "tailwindcss"; @import "@nuxt/ui"; Wrap your app with the App component: app.vue

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
Changes from v2
Now that you have updated your project, you can start migrating your code. Here's a comprehensive list of all the breaking changes in Nuxt UI v3.

Updated design system In Nuxt UI v2, we had a mix between a design system with primary, gray, error
aliases and all the colors from Tailwind CSS. We've replaced it with a proper design system with 7
color aliases:

Color Default Description primary green Main brand color, used as the default color for components.
secondary blue Secondary color to complement the primary color. success green Used for success
states. info blue Used for informational states. warning yellow Used for warning states. error red
Used for form error validation states. neutral slate Neutral color for backgrounds, text, etc. This
change introduces several breaking changes that you need to be aware of:

The gray color has been renamed to neutral

<template>
- <p class="text-gray-500 dark:text-gray-400" />
+ <p class="text-neutral-500 dark:text-neutral-400" />
</template>
You can also use the new design tokens to handle light and dark mode:

<template>
- <p class="text-gray-500 dark:text-gray-400" />
+ <p class="text-(--ui-text-muted)" />

- <p class="text-gray-900 dark:text-white" />

* <p class="text-(--ui-text-highlighted)" />
  </template>
  The DEFAULT shade that let you write text-primary no longer exists, you can use color shades instead:

<template>
-  <p class="text-primary">Hello</p>
+  <p class="text-(--ui-primary)">Hello</p>
</template>
The gray, black and white in the color props have been removed in favor of neutral:

- <UButton color="black" />

* <UButton color="neutral" />

- <UButton color="gray" />

* <UButton color="neutral" variant="subtle" />

- <UButton color="white" />

* <UButton color="neutral" variant="outline" />
  You can no longer use Tailwind CSS colors in the color props, use the new aliases instead:

- <UButton color="red" />

* <UButton color="error" />
  Learn how to extend the design system to add new color aliases.
  The color configuration in app.config.ts has been moved into a colors object:

export default defineAppConfig({ ui: {

- primary: 'green',
- gray: 'cool'

* colors: {
*     primary: 'green',
*     neutral: 'slate'
* } } }) Updated theming system Nuxt UI components are now styled using the Tailwind Variants API,
  which makes all the overrides you made using the app.config.ts and the ui prop obsolete.

Update your app.config.ts to override components with their new theme:

export default defineAppConfig({ ui: { button: {

-       font: 'font-bold',
-       default: {
-         size: 'md',
-         color: 'primary'
-       }

*       slots: {
*         base: 'font-medium'
*       },
*       defaultVariants: {
*         size: 'md',
*         color: 'primary'
*       }
       }
  } }) Update your ui props to override each component's slots using their new theme:

<template>
- <UButton :ui="{ font: 'font-bold' }" />
+ <UButton :ui="{ base: 'font-bold' }" />
</template>
We can't detail all the changes here but you can check each component's theme in the Theme section.
Renamed components
We've renamed some Nuxt UI components to align with the Reka UI naming convention:

v2 v3 Divider Separator Dropdown DropdownMenu FormGroup FormField Range Slider Toggle Switch
Notification Toast VerticalNavigation NavigationMenu with orientation="vertical"
HorizontalNavigation NavigationMenu with orientation="horizontal" Changed components In addition to
the renamed components, there are lots of changes to the components API. Let's detail the most
important ones:

The links and options props have been renamed to items for consistency:

<template>
- <USelect :options="countries" />
+ <USelect :items="countries" />

- <UHorizontalNavigation :links="links" />

* <UNavigationMenu :items="links" />
  </template>
  This change affects the following components: Breadcrumb, HorizontalNavigation, InputMenu, RadioGroup, Select, SelectMenu, VerticalNavigation.
  The click field in different components has been removed in favor of the native Vue onClick event:

<script setup lang="ts">
const items = [{
  label: 'Edit',
-  click: () => {
+  onClick: () => {
    console.log('Edit')
  }
}]
</script>

This change affects the Toast component as well as all component that have items links like
NavigationMenu, DropdownMenu, CommandPalette, etc. The global Modals, Slideovers and Notifications
components have been removed in favor the App component: app.vue

<template>
+  <UApp>
+    <NuxtPage />
+  </UApp>
-  <UModals />
-  <USlideovers />
-  <UNotifications />
</template>
The v-model:open directive and default-open prop are now used to control visibility:

<template>
- <UModal v-model="open" />
+ <UModal v-model:open="open" />
</template>
This change affects the following components: ContextMenu, Modal and Slideover and enables controlling visibility for InputMenu, Select, SelectMenu and Tooltip.
The default slot is now used for the trigger and the content goes inside the #content slot (you don't need to use a v-model:open directive with this method):

<script setup lang="ts">
- const open = ref(false)
</script>

<template>
- <UButton label="Open" @click="open = true" />

- <UModal v-model="open">

* <UModal>
* <UButton label="Open" />

* <template #content>
    <div class="p-4">
      <Placeholder class="h-48" />
    </div>
* </template>
    </UModal>
  </template>
  This change affects the following components: Modal, Popover, Slideover, Tooltip.
  A #header, #body and #footer slots have been added inside the #content slot like the Card component:

<template>
- <UModal>
+ <UModal title="Title" description="Description">
-   <div class="p-4">
+   <template #body>
      <Placeholder class="h-48" />
+   </template>
-   </div>
  </UModal>
</template>
This change affects the following components: Modal, Slideover.
Changed composables
The useToast() composable timeout prop has been renamed to duration:

<script setup lang="ts">
const toast = useToast()

- toast.add({ title: 'Invitation sent', timeout: 0 })
+ toast.add({ title: 'Invitation sent', duration: 0 })
</script>

The useModal and useSlideover composables have been removed in favor of a more generic useOverlay
composable: Some important differences:

The useOverlay composable is now used to create overlay instances Overlays that are opened, can be
awaited for their result Overlays can no longer be close using modal.close() or slideover.close(),
rather, they close automatically: either when a close event is fired explicitly from the opened
component OR when the overlay closes itself (clicking on backdrop, pressing the ESC key, etc) To
capture the return value in the parent component you must explictly emit a close event with the
desired value

<script setup lang="ts">
import { ModalExampleComponent } from '#components'

- const modal = useModal()
+ const overlay = useOverlay()

- modal.open(ModalExampleComponent)
+ const modal = overlay.create(ModalExampleComponent)
</script>

Props are now passed through a props attribute:

<script setup lang="ts">
import { ModalExampleComponent } from '#components'

- const modal = useModal()
+ const overlay = useOverlay()

const count = ref(0)

- modal.open(ModalExampleComponent, {
-   count: count.value
- })
+ const modal = overlay.create(ModalExampleComponent, {
+   props: {
+     count: count.value
+   }
+ })
</script>

Closing a modal is now done through the close event. The modal.open method now returns a promise
that resolves to the result of the modal whenever the modal is close:

<script setup lang="ts">
import { ModalExampleComponent } from '#components'

- const modal = useModal()
+ const overlay = useOverlay()

+ const modal = overlay.create(ModalExampleComponent)

- function openModal() {
-   modal.open(ModalExampleComponent, {
-     onSuccess() {
-       toast.add({ title: 'Success!' })
-     }
-   })
- }
+ async function openModal() {
+   const result = await modal.open(ModalExampleComponent, {
+     count: count.value
+   })
+
+   if (result) {
+     toast.add({ title: 'Success!' })
+   }
+ }
</script>
