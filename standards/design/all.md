### Full Atomic Structure
With these additions, your Style Guide now includes:
1. **Glass Components**: Rules for IBGlass usage.
2. **Animations and Transitions**: Initial guide (expanded in #9).
3. **Card Design**: Standardized card styling.
4. **Color Usage**: Theme-consistent palette.
5. **Interactive Elements**: Buttons and interactive UX.
6. **Layout Structure**: Responsive grid and spacing.
7. **Background Elements**: Starfield and decorative effects.
8. **Content Organization**: Structured, mobile-friendly content.
9. **Animations and Transitions (Expanded)**: Full animation rules.

This covers all 10 rules from your summary, organized atomically. Each guide is self-contained yet integrates with Tailwind v3+, PrimeVue v4+, and `theme.ts`.

## IDEAS

- Use v-for loops and content in arrays to make code more maintainable if dealing with repeating code in SFC templates.





### Next Steps
- **Validation**: I can refine these further with more specific `theme.ts` details if you share them (e.g., exact color values).
- **Consolidation**: Combine these into a single master Style Guide for LLMs if preferred.
- **Expansion**: Add guides for specific PrimeVue components (e.g., `DataTable`, `Chart`) or admin dashboard specifics.

Let me know how you’d like to proceed!

# AstronEra Glass Components Style Guide

## Overview

Glass components (IBGlass) provide a frosted, translucent effect that enhances the space-themed
aesthetic. They must be used thoughtfully to maintain readability and performance.

## Rules

1. **Placement**:

   - Place IBGlass components directly on the starfield or black background (`bg-black` in
     Tailwind).
   - Never layer glass components on top of each other to avoid visual clutter and maintain clarity.

2. **Intensity Settings**:

   - Use `intensity-low` (e.g., `backdrop-blur-sm opacity-10`) for secondary content.
   - Use `intensity-medium` (e.g., `backdrop-blur-md opacity-20`) for primary content.
   - Use `intensity-high` (e.g., `backdrop-blur-lg opacity-30`) for critical UI elements like modals
     or alerts.

3. **Styling with Tailwind**:

   - Apply `bg-gray-900/20` for the base glass effect, paired with `backdrop-blur-md`.
   - Use `border border-gray-800/30` for subtle edges.
   - Ensure text contrast with `text-white` or `text-gray-200`.

4. **PrimeVue Integration**:

   - Map IBGlass to PrimeVue’s `Panel` or `Card` components with custom classes in `theme.ts`.
   - Example: `<Panel class="ib-glass intensity-medium">`.

5. **Accessibility**:
   - Maintain WCAG 2.1 AA contrast ratios (e.g., 4.5:1 for text) against the glass background.

## Example

```html
<div class="bg-black min-h-screen">
  <div
    class="ib-glass intensity-medium bg-gray-900/20 backdrop-blur-md border border-gray-800/30 p-4 text-white"
  >
    <h2 class="text-lg font-semibold">Stellar Data</h2>
    <p>Key information here.</p>
  </div>
</div>
```

---

### Style Guide 2: Animations and Transitions

**Purpose:** Ensure consistent, performant animations that enhance UX without compromising
snappiness.

# AstronEra Animations and Transitions Style Guide

## Overview

Animations add depth and engagement to the astronomy experience, using the `useAnimation` composable
and Tailwind/PrimeVue utilities.

## Rules

1. **Implementation**:

   - Use the `useAnimation` composable for all animations, referencing `MOTION_CONSTANTS` for timing
     (e.g., `duration-300`).
   - Apply Tailwind’s `transition` classes (e.g., `transition-transform duration-200 ease-in-out`).

2. **Staggered Animations**:

   - For lists or grids, stagger animations with `data-stagger="0.1s"` and `useAnimation` logic.
   - Example: Cards fade in sequentially with a 100ms delay.

3. **Performance**:

   - Only animate elements in the viewport using Intersection Observer via `useAnimation`.
   - Avoid layout shifts by using `transform` or `opacity` instead of `width`/`height`.

4. **Specific Effects**:

   - **Hover**: Use `hover:scale-102` (1.02 scale) with `transition-transform duration-200`.
   - **Page Transitions**: Implement smooth view transitions with
     `transition-all duration-300 ease-out`.
   - **Timing**: Use consistent easing from `MOTION_CONSTANTS` (e.g., `ease-in-out`).

5. **PrimeVue Integration**:
   - Apply animations to PrimeVue components like `Button` or `Dialog` via `enterActiveClass` and
     `leaveActiveClass`.

## Example

```html
<div
  class="grid gap-4"
  v-animation.stagger="{ delay: 100 }"
>
  <div class="transition-transform duration-200 ease-in-out hover:scale-102">
    <p>Animated Element</p>
  </div>
</div>
```

---

### Style Guide 3: Card Design

**Purpose:** Standardize card components for consistent layout and interaction.

# AstronEra Card Design Style Guide

## Overview

Cards are core content containers, designed for clarity and responsiveness using Tailwind and
PrimeVue.

## Rules

1. **Dimensions**:

   - Use fixed sizes: `w-80` (320px) for desktop, `w-full` for mobile to prevent layout shifts.
   - Apply `min-h-[200px]` for consistent height.

2. **Hover Effects**:

   - Use `hover:scale-102` with `transition-transform duration-200 ease-in-out`.
   - Avoid dimensional changes to maintain layout stability.

3. **Padding and Spacing**:

   - Apply `p-4` for internal padding and `space-y-2` for content spacing.
   - Use `gap-4` in parent grids for consistent external spacing.

4. **Typography**:

   - Headings: `text-lg font-semibold text-white`.
   - Body: `text-base text-gray-200`.
   - Subtext: `text-sm text-gray-400`.

5. **PrimeVue Integration**:
   - Use `Card` component with custom Tailwind classes from `theme.ts`.

## Example

```html
<div
  class="w-80 min-h-[200px] p-4 bg-gray-900/20 backdrop-blur-md border border-gray-800/30 transition-transform duration-200 hover:scale-102"
>
  <h3 class="text-lg font-semibold text-white">Nebula Info</h3>
  <p class="text-base text-gray-200">Details about this nebula.</p>
  <p class="text-sm text-gray-400">Source: AstronEra</p>
</div>
```

---

### Style Guide 4: Color Usage

**Purpose:** Define a cohesive color palette for accessibility and theme consistency.

# AstronEra Color Usage Style Guide

## Overview

The color scheme reflects an astronomy-inspired dark theme with blue-purple accents, managed via
`theme.ts`.

## Rules

1. **Base Palette**:

   - Background: `bg-black` or starfield.
   - Text: `text-white` (primary), `text-gray-200` (secondary).
   - Accents: `primary-600` (blue), `secondary-600` (purple).

2. **Gradients**:

   - Use `bg-gradient-to-r from-primary-600 to-secondary-600` for visual interest.
   - Apply to headers, buttons, or decorative elements.

3. **Contrast**:

   - Ensure 4.5:1 contrast for text (e.g., `text-white` on `bg-primary-600`).
   - Test with Tailwind’s opacity modifiers (e.g., `bg-primary-600/80`).

4. **PrimeVue Integration**:
   - Map colors to PrimeVue’s theme variables in `theme.ts` (e.g., `--primary-color: #2563eb`).

## Example

```html
<button class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-md">
  Explore
</button>
```

---

### Style Guide 5: Interactive Elements

**Purpose:** Standardize buttons, links, and other interactive components for usability.

# AstronEra Interactive Elements Style Guide

## Overview

Interactive elements enhance engagement with subtle, consistent effects using Tailwind and PrimeVue.

## Rules

1. **Hover Effects**:

   - Apply `hover:scale-102` with `transition-transform duration-200 ease-in-out`.
   - Use `hover:bg-primary-700` for background shifts.

2. **Button Styling**:

   - Base: `px-4 py-2 rounded-md bg-primary-600 text-white`.
   - Spacing: `space-x-2` for icon-text alignment.

3. **Focus States**:

   - Add `focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50` for accessibility.
   - Use glow effect: `shadow-[0_0_10px_rgba(59,130,246,0.5)]`.

4. **Transitions**:

   - Apply `transition-all duration-200 ease-in-out` for smooth state changes.

5. **PrimeVue Integration**:
   - Use `Button` component with custom classes from `theme.ts`.

## Example

```html
<button
  class="px-4 py-2 rounded-md bg-primary-600 text-white transition-all duration-200 hover:scale-102 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
>
  Click Me
</button>
```

---

### Style Guide 6: Layout Structure

**Purpose:** Define responsive layouts and spacing for a clear hierarchy.

# AstronEra Layout Structure Style Guide

## Overview

Layouts ensure a responsive, organized structure using Tailwind’s grid and spacing utilities.

## Rules

1. **Grid System**:

   - Desktop: `grid grid-cols-3 gap-4`.
   - Tablet: `md:grid-cols-2`.
   - Mobile: `sm:grid-cols-1`.

2. **Spacing**:

   - Use `gap-4` for grid items, `space-y-6` for vertical rhythm.
   - Section padding: `py-8 px-4`.

3. **Hierarchy**:

   - Headings: `text-2xl font-bold text-white`.
   - Subheadings: `text-xl text-gray-200`.

4. **Responsiveness**:
   - Stack elements on mobile with `flex flex-col sm:flex-row`.

## Example

```html
<div class="py-8 px-4">
  <h1 class="text-2xl font-bold text-white">Galaxies</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
    <!-- Card components here -->
  </div>
</div>
```

# AstronEra Background Elements Style Guide

## Overview

Backgrounds create an immersive astronomy experience, using a starfield base and subtle effects
managed via Tailwind and the `useStarfield` composable.

## Rules

1. **Starfield Background**:

   - Apply `bg-black` with a starfield overlay as the default background across all pages.
   - Use `useStarfield` composable to generate dynamic stars, configured in `theme.ts`.

2. **Parallax Effects**:

   - Implement subtle parallax with `data-parallax="0.2"` and `useStarfield` logic.
   - Limit motion to `translate-y` (e.g., `transform translate-y-2`) for performance.

3. **Decorative Elements**:

   - Add shooting stars and pulsing stars via `useStarfield` with low frequency (e.g., 1-2 per 10
     seconds).
   - Use `opacity-50` and `transition-opacity duration-1000` for smooth fading.

4. **Layering**:

   - Maintain z-index structure: Starfield (`z-0`), Glass/Content (`z-10`), Modals (`z-20`).
   - Ensure decorative elements stay behind content with `z-[-1]`.

5. **PrimeVue Integration**:
   - Apply background classes to PrimeVue `OverlayPanel` or `Dialog` wrappers for consistency.

## Example

```html
<div class="bg-black min-h-screen relative overflow-hidden">
  <div
    class="starfield absolute inset-0 z-0"
    v-starfield="{ shootingStars: true, pulse: true }"
  ></div>
  <div class="relative z-10 p-4">
    <h1 class="text-white text-2xl">Welcome to AstronEra</h1>
  </div>
</div>
```

---

### Style Guide 8: Content Organization

**Purpose:** Structure content for clarity, accessibility, and mobile optimization.

# AstronEra Content Organization Style Guide

## Overview

Content is organized to prioritize key information and ensure usability across devices, leveraging
Tailwind and PrimeVue components.

## Rules

1. **Section Divisions**:

   - Use `border-b border-gray-800` or `mb-6` to separate sections.
   - Headings: `text-2xl font-bold text-white` with `mb-4`.

2. **Progressive Disclosure**:

   - Place critical info first with `text-lg text-white`.
   - Use `Accordion` or `Collapse` from PrimeVue for secondary details, styled with Tailwind.

3. **Mobile Optimization**:

   - Stack content with `flex flex-col sm:flex-row` on mobile.
   - Use PrimeVue `TabView` for dense content, with `p-tabview-nav` customized via `theme.ts`.

4. **Typography**:

   - Body: `text-base text-gray-200`.
   - Links: `text-primary-500 hover:text-primary-400`.

5. **PrimeVue Integration**:
   - Use `Panel` or `Card` for sectioned content, with `header` slots for headings.

## Example

```html
<section class="py-8 px-4">
  <h2 class="text-2xl font-bold text-white mb-4">Star Systems</h2>
  <p class="text-lg text-white mb-2">Key facts about nearby stars.</p>
  <p-tabview class="sm:hidden">
    <p-tabpanel header="Details">
      <p class="text-base text-gray-200">More info here.</p>
    </p-tabpanel>
  </p-tabview>
  <div class="hidden sm:block text-base text-gray-200">More info here.</div>
</section>
```

---

### Style Guide 9: Animations and Transitions (Expanded)

**Purpose:** Provide a comprehensive guide for all animations and transitions, fully addressing rule
#9.

# AstronEra Animations and Transitions Style Guide

## Overview

Animations enhance UX with consistent, performant motion effects using `useAnimation`, Tailwind, and
PrimeVue.

## Rules

1. **Core Implementation**:

   - Use `useAnimation` composable with `MOTION_CONSTANTS` (e.g., `duration-300`, `ease-in-out`).
   - Apply Tailwind `transition` classes (e.g., `transition-transform duration-200`).

2. **Staggered Animations**:

   - For related elements (e.g., cards), use `data-stagger="0.1s"` with `useAnimation`.
   - Example: `v-animation.stagger="{ delay: 100 }"` for sequential fades.

3. **Page Transitions**:

   - Implement view transitions with `transition-all duration-300 ease-out`.
   - Use PrimeVue `router-view` with `transition` prop for smooth page swaps.

4. **Hover Animations**:

   - Apply `hover:scale-102` with `transition-transform duration-200 ease-in-out`.
   - Add `hover:opacity-90` for subtle feedback on buttons.

5. **Performance**:

   - Trigger animations only in viewport via Intersection Observer in `useAnimation`.
   - Avoid layout shifts with `transform` or `opacity` instead of dimensional changes.

6. **Motion.js Integration**:

   - Use `motion.js` for complex animations (e.g., starfield pulsing), tied to `MOTION_CONSTANTS`.

7. **PrimeVue Integration**:
   - Customize `enterActiveClass` and `leaveActiveClass` on components like `Dialog`.

## Example

```html
<template>
  <router-view v-slot="{ Component }">
    <transition
      name="fade"
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>
  <div
    class="grid gap-4"
    v-animation.stagger="{ delay: 100 }"
  >
    <div class="transition-transform duration-200 ease-in-out hover:scale-102">Item</div>
  </div>
</template>
```
