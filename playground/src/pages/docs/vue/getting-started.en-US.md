---
title: Getting Started
---

Antdv Next is dedicated to providing a **good development experience** for programmers.

> Before starting, it is recommended to learn [Vue](https://vuejs.dev) first, and correctly install and configure [Node.js](https://nodejs.org/) v20 or above. The official guide assumes that you have intermediate knowledge about HTML, CSS, and JavaScript, and have fully mastered the correct development approach with the Vue ecosystem. If you are just starting to learn front-end or Vue, it may not be the best idea to use the UI framework as your first step.

---

## Your First Example

Here is a simple online stackblitz demo of an Antdv Next component to show the usage of Antdv Next.

<iframe src="https://stackblitz.com/edit/vitejs-vite-stk21cho?embed=1&file=src%2FApp.vue&hideExplorer=1&hideNavigation=1" width="100%" height="500px" frameborder="0"></iframe>

### 1. Create a stackblitz

Visit [Antdv Next Start Template](https://stackblitz.com/edit/vitejs-vite-stk21cho?file=src%2FApp.vue) to create an online stackblitz example -- don't forget to save to create a new instance.

### 2. Use a Component

Replace the contents of `App.vue` with the following code. As you can see, you can directly use `antdv-next` components with the SFC approach.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-date-picker v-model:value="value" need-confirm />
</template>
```

### 3. Explore More Components

You can view the list of components in the side menu of the Components page, such as the [Alert](/components/alert) component. Plenty of examples are also provided in the component pages and API documentation at the bottom.

Find the first example in the code demo section and click the icon in the bottom right corner to expand the code. You can copy the code directly to your stackblitz to try and adjust it yourself.

## Import on Demand

### Tree Shaking Import

`antdv-next` supports tree shaking of ES modules by default, so using `import { Button } from 'antdv-next';` would drop js code you didn't use.

### Auto Import with `unplugin-vue-components`

You can use [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) to achieve automatic on-demand import.

We provide a library adapter `@antdv-next/auto-import-resolver`.

#### Installation

```shell
# via npm
npm i @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via yarn
yarn add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via pnpm
pnpm add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via Bun
bun add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D
```

#### Usage

> This section only introduces usage with Vite. For more details, please refer to [@antdv-next/auto-import-resolver](https://www.npmjs.com/package/@antdv-next/auto-import-resolver).

```ts
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
})
```
