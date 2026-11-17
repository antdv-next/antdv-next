---
title: Introducing Antdv Next Mobile - Write Mobile the Way You Write Desktop
datetime: 2026-11-16
author: aibayanyu20
---

Today we would like to introduce a new member of the Antdv Next family: **[@antdv-next/mobile](https://m.antdv-next.com)**, a mobile component library for Vue 3.

Ever since Antdv Next was released, one of the questions we have heard most often is: "Is there a matching mobile solution?"
Many teams run their admin consoles on desktop, yet their H5 campaign pages, mini-program web views and in-app WebViews need a completely different component library, with a different API, a different theme system and a different mental model.

That is the problem Antdv Next Mobile sets out to solve: **if you know Antdv Next, you already know how to use it.**

## Two Goals {#goals}

### PC Parity First {#pc-parity}

Whenever a concept exists in Antdv Next, the mobile library uses **the same name, the same type and the same semantics**:

- Visibility is `v-model:open`, values are `v-model:value` / `v-model:checked`
- Data-driven content uses `items`, `options` and `fieldNames`
- Size is `size="small | middle | large"`, validation is `status`, appearance is `variant`
- Semantic structure is `rootClass`, `classes` and `styles`
- Every render-type prop has a slot of the same name, and the slot wins
- Static APIs are `Modal.confirm`, `message.success` and `App.useApp()`

So migrating a form is mostly a matter of changing the prefix from `a-` to `am-`:

```vue
<am-form :model="form" @finish="onFinish">
  <am-form-item label="Name" name="name" :rules="[{ required: true }]">
    <am-input v-model:value="form.name" />
  </am-form-item>
  <am-form-item label="Birthday" name="birthday">
    <am-date-picker v-model:value="form.birthday" />
  </am-form-item>
  <am-button type="primary" html-type="submit" block>
    Submit
  </am-button>
</am-form>
```

The full mapping is in [PC Parity](https://m.antdv-next.com/docs/pc-parity).

### Mobile First {#mobile-first}

Aligning the API does not mean shrinking desktop components. Every component is redesigned for touch:

- Dropdown panels become **bottom sheets**: Select, Cascader, DatePicker, TimePicker and ColorPicker all open from the bottom, and dates and times are picked with wheels
- Hover feedback becomes `:active` **press feedback**, with touch targets of at least 40px
- **Gestures** are first-class: swipe between Tabs, momentum scrolling in Carousel, swipe to dismiss a notification, drag a FloatButton and let it snap to the edge
- **Safe-area** support and scroll locking are built in
- Data-driven lists (Select, Cascader, List, Picker, Calendar) use **virtual scrolling** by default, so thousands of rows stay smooth

Desktop-only capabilities (hover, resizing, keyboard-heavy navigation) are simply dropped, and components that do not suit small screens, such as Table, Transfer and Splitter, are not provided for now.
Every difference from the desktop version is listed in the "Differences from PC" section at the end of each component page, so you never have to guess.

## What Is Included {#components}

More than 80 components are available today, grouped into General, Layout, Navigation, Data Entry, Data Display, Feedback, and Gestures & Others.

Besides the components that share a name with their desktop counterpart, there is a set of mobile-only ones:

- **Navigation**: NavBar, TabBar, SideBar, IndexBar
- **Popups & feedback**: Popup, ActionSheet, Toast, NoticeBar, FloatingPanel, ShareSheet
- **Data entry**: Picker, Calendar, Selector, NumberKeyboard, Signature
- **Gestures**: PullToRefresh, InfiniteScroll, SwipeAction, ImagePreview

The library also exports more than 30 composables, such as `useRequest`, `useLoadMore`, `useCountDown`, `useSwipe` and `useKeyboard`, which remove a lot of the boilerplate that mobile pages usually need.

The documentation site ships with a phone simulator on the right, where every demo is interactive. You can also open [m.antdv-next.com/mobile.html](https://m.antdv-next.com/mobile.html) directly on your phone.

## Some Different Technical Choices {#tech-choices}

Mobile has different constraints from desktop, so instead of copying the implementation of Antdv Next, we made a few different decisions.

### Pure CSS Variable Theming {#css-variables}

Antdv Next follows the CSS-in-JS system of Ant Design v6. On mobile, first-screen size and runtime cost matter more, so there is **no CSS-in-JS runtime** here: all styles are plain CSS, and theming is driven entirely by `--am-*` variables.

```css
:root {
  --am-color-primary: #7c3aed;
  --am-border-radius: 12px;
}
```

The `theme` API you already know still works. The dark and compact algorithms can be combined, and themes can be nested through ConfigProvider:

```vue
<script setup lang="ts">
import { theme } from '@antdv-next/mobile'
</script>

<template>
  <am-config-provider :theme="{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00b96b' } }">
    <App />
  </am-config-provider>
</template>
```

### Written Entirely with `<script setup>` {#script-setup}

Every component is a `<script setup lang="ts">` single-file component, with no TSX. The typed contract of props, emits and slots lives in each component's `interface.ts`, so type hints are complete and the source reads like the Vue you write every day.

### On-demand Import {#on-demand}

The output is ESM that preserves the module structure, styles load with their components, and tree shaking works out of the box. With `unplugin-vue-components`, you can use the built-in resolver for auto import:

```ts
// vite.config.ts
import { AntdvNextMobileResolver } from '@antdv-next/mobile/resolver'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [AntdvNextMobileResolver()] }),
  ],
})
```

### Design Draft Adaptation {#adaptation}

No mobile project escapes design draft adaptation: some use `vw`, some use `rem`, some design at 375 and others at 750.

Our approach is to make every length in the library follow a single variable, `--am-unit` (default `1px`). You only tell it how long one unit is, and the whole library scales with your approach, with no build configuration:

```css
:root {
  /* scale with the viewport */
  --am-unit: calc(100vw / 375);
}
```

This capability has landed on the main branch and will ship with the next release. See [Design Adaptation](https://m.antdv-next.com/docs/adaptation) for details.

## Getting Started {#getting-started}

```bash
pnpm add @antdv-next/mobile
```

```ts
import AntdvMobile from '@antdv-next/mobile'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(AntdvMobile).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Open popup
  </am-button>
  <am-popup v-model:open="open" round closable>
    Hello Antdv Mobile
  </am-popup>
</template>
```

### Browser Support {#browsers}

The theme system relies on CSS `color-mix()`, so it requires iOS Safari 16.2+ and Android Chrome / WebView 111+. If your product still has to support older system versions, please evaluate this before adopting it.

## Current Status {#status}

To be upfront: Antdv Next Mobile is still in its **early 0.x stage**.

That means:

- The components are usable, but they have not yet been polished enough on real devices and in real products
- Before 1.0, the API may still change in response to feedback
- If you plan to use it in production, pin the version and read the changelog before upgrading

We chose to release it early because we want it to grow from real-world feedback, rather than polishing it behind closed doors until it is "perfect".

## Get Involved {#contributing}

If you run into a problem, or find a component that behaves differently from its desktop counterpart without the docs saying so, please let us know through an [Issue](https://github.com/antdv-next/antdv-next-mobile/issues). [Pull requests](https://github.com/antdv-next/antdv-next-mobile/pulls) are very welcome too.

- Docs: [m.antdv-next.com](https://m.antdv-next.com)
- Repository: [antdv-next/antdv-next-mobile](https://github.com/antdv-next/antdv-next-mobile)
- npm: [@antdv-next/mobile](https://www.npmjs.com/package/@antdv-next/mobile)

Like Antdv Next, it belongs to the community and will serve the community for the long run.
