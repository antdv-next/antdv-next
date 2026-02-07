---
title: 快速上手
---

Antdv Next 致力于提供给程序员**愉悦**的开发体验。

> 在开始之前，推荐先学习 [Vue](https://vuejs.dev)，并正确安装和配置了 [Node.js](https://nodejs.org/) v20 或以上。官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Vue 全家桶的正确开发方式。如果你刚开始学习前端或者 Vue，将 UI 框架作为你的第一步可能不是最好的主意。

---

## 第一个例子

这是一个最简单的 Antdv Next 组件的在线 stackblitz 演示。

<iframe src="https://stackblitz.com/edit/vitejs-vite-stk21cho?embed=1&file=src%2FApp.vue&hideExplorer=1&hideNavigation=1" width="100%" height="500px" frameborder="0"></iframe>

### 1. 创建一个 stackblitz

访问 [Antdv Next Start Template](https://stackblitz.com/edit/vitejs-vite-stk21cho?file=src%2FApp.vue) 创建一个 stackblitz 的在线示例，别忘了保存以创建一个新的实例。

### 2. 使用组件

直接用下面的代码替换 `App.vue` 的内容，用 Sfc 的方式直接使用 `antdv-next` 组件。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-date-picker v-model:value="value" need-confirm />
</template>
```

### 3. 探索更多组件用法

你可以在组件页面的左侧菜单查看组件列表，比如 [Alert](/components/alert-cn) 组件，组件文档中提供了各类演示，最下方有组件 API 文档可以查阅。在代码演示部分找到第一个例子，点击右下角的图标展开代码。

你需要测试哪个demo，你可以直接复制代码到你的 stackblitz 进行尝试自行调整。

## 按需加载

### 引入按需加载

`antdv-next`默认支持基于 ES modules 的 tree shaking，直接引入 `import { Button } from 'antdv-next';` 就会有按需加载的效果。

### 借助`unplugin-vue-components`实现自动按需加载

你可以通过 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)来实现自动按需加载。

我们提供了库适配器的库`@antdv-next/auto-import-resolver`

#### 安装

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

#### 使用

> 这里只介绍vite的使用方式，具体的请参考[@antdv-next/auto-import-resolver](https://www.npmjs.com/package/@antdv-next/auto-import-resolver)

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
