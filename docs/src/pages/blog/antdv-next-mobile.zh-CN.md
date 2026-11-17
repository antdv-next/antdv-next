---
title: Antdv Next Mobile 来了：用写 PC 的方式写移动端
datetime: 2026-11-16
author: aibayanyu20
---

今天，我们想向大家介绍 Antdv Next 家族的新成员 —— **[@antdv-next/mobile](https://m.antdv-next.com)**，一套基于 Vue 3 的移动端组件库。

自 Antdv Next 发布以来，我们收到最多的问题之一就是：“有没有配套的移动端方案？”
很多团队的后台跑在 PC 上，H5 活动页、小程序内嵌页、App 内 WebView 却要换一套完全不同的组件库，两边的 API、主题、心智模型都对不上。

Antdv Next Mobile 想解决的就是这件事：**只要你会用 Antdv Next，你就已经会用它了。**

## 两个目标 {#goals}

### PC 对齐优先 {#pc-parity}

只要某个概念在 Antdv Next 中存在，移动端就使用**同样的名字、同样的类型、同样的语义**：

- 显隐用 `v-model:open`，取值用 `v-model:value` / `v-model:checked`
- 数据驱动用 `items`、`options`、`fieldNames`
- 尺寸是 `size="small | middle | large"`，校验状态是 `status`，形态是 `variant`
- 语义化结构是 `rootClass`、`classes`、`styles`
- 渲染类属性都有同名插槽，且插槽优先
- 静态方法是 `Modal.confirm`、`message.success`、`App.useApp()`

所以迁移一个表单，基本只需要把前缀从 `a-` 换成 `am-`：

```vue
<am-form :model="form" @finish="onFinish">
  <am-form-item label="姓名" name="name" :rules="[{ required: true }]">
    <am-input v-model:value="form.name" />
  </am-form-item>
  <am-form-item label="生日" name="birthday">
    <am-date-picker v-model:value="form.birthday" />
  </am-form-item>
  <am-button type="primary" html-type="submit" block>
    提交
  </am-button>
</am-form>
```

完整的对照表见 [与 PC 端对齐](https://m.antdv-next.com/docs/pc-parity-cn)。

### 移动端优先 {#mobile-first}

对齐 API 不等于把桌面组件缩小。每个组件都按触屏重新设计：

- 下拉面板变成**底部弹层**：Select、Cascader、DatePicker、TimePicker、ColorPicker 都从底部弹出，日期与时间使用滚轮选择
- 悬停反馈变成 `:active` **按压反馈**，触控区域不小于 40px
- **手势**是一等公民：Tabs 滑动切换、Carousel 惯性滚动、notification 滑动关闭、FloatButton 拖拽吸边
- 内置**安全区**适配与滚动锁定
- 数据驱动的长列表（Select、Cascader、List、Picker、Calendar）默认走**虚拟滚动**，上千条数据也不会卡

那些只属于 PC 的能力（悬停、拖拽调整尺寸、重度键盘导航）被直接去掉，Table、Transfer、Splitter 这类不适合小屏的组件也暂未提供。
每一处与 PC 不一致的地方，都写在对应组件文档末尾的「与 PC 端的差异」一节里，不需要你自己去猜。

## 有哪些组件 {#components}

目前已经提供 80 多个组件，分为通用、布局、导航、数据录入、数据展示、反馈、手势与其他七类。

除了与 PC 同名的组件，还有一批移动端独有的组件：

- **导航**：NavBar、TabBar、SideBar、IndexBar
- **弹层与反馈**：Popup、ActionSheet、Toast、NoticeBar、FloatingPanel、ShareSheet
- **录入**：Picker、Calendar、Selector、NumberKeyboard、Signature
- **手势**：PullToRefresh、InfiniteScroll、SwipeAction、ImagePreview

另外还随库导出了 30 余个组合式函数，例如 `useRequest`、`useLoadMore`、`useCountDown`、`useSwipe`、`useKeyboard`，移动端页面里常见的那些样板代码可以少写很多。

文档站右侧自带一个手机模拟器，所有示例都能直接上手操作；也可以用手机直接打开 [m.antdv-next.com/mobile.html](https://m.antdv-next.com/mobile.html) 体验。

## 一些不一样的技术选择 {#tech-choices}

移动端的约束和 PC 不同，所以在实现上我们没有照搬 Antdv Next，而是做了几个不一样的决定。

### 纯 CSS 变量主题 {#css-variables}

Antdv Next 沿用了 Ant Design v6 的 CSS-in-JS 体系。而在移动端，首屏体积与运行时开销更加敏感，所以这里**没有 CSS-in-JS 运行时**：所有样式都是普通 CSS，主题完全由 `--am-*` 变量驱动。

```css
:root {
  --am-color-primary: #7c3aed;
  --am-border-radius: 12px;
}
```

同时，你熟悉的 `theme` 写法仍然可用，暗色与紧凑算法可以组合，也可以通过 ConfigProvider 嵌套：

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

### 全部使用 `<script setup>` 编写 {#script-setup}

所有组件都是 `<script setup lang="ts">` 单文件组件，没有 TSX。Props、Emits、Slots 的类型契约集中在每个组件的 `interface.ts` 中，类型提示完整，源码读起来也就是你平时写的 Vue。

### 按需引入 {#on-demand}

产物是保留模块结构的 ESM，样式随组件自动加载，天然支持 Tree Shaking。配合 `unplugin-vue-components`，可以使用内置的 resolver 自动导入：

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

### 设计稿适配 {#adaptation}

移动端项目绕不开设计稿适配：有人用 `vw`，有人用 `rem`，有人是 375 稿，有人是 750 稿。

我们的做法是让组件库的所有长度都跟随一个变量 `--am-unit`（默认 `1px`）。你只需要告诉它“1 个单位有多长”，整个组件库就会跟随你的方案缩放，不需要任何构建配置：

```css
:root {
  /* 按视口等比缩放 */
  --am-unit: calc(100vw / 375);
}
```

这项能力已经合入主干，将随下一个版本发布，详见 [设计稿适配](https://m.antdv-next.com/docs/adaptation-cn)。

## 快速开始 {#getting-started}

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
    打开弹层
  </am-button>
  <am-popup v-model:open="open" round closable>
    Hello Antdv Mobile
  </am-popup>
</template>
```

### 浏览器支持 {#browsers}

主题系统依赖 CSS `color-mix()`，因此需要 iOS Safari 16.2+、Android Chrome / WebView 111+。如果你的业务还需要兼容更早的系统版本，请在接入前先评估。

## 当前状态 {#status}

需要坦诚说明的是：Antdv Next Mobile 目前还处于 **0.x 的早期阶段**。

这意味着：

- 组件已经可以使用，但在真实机型、真实业务中的打磨还远远不够
- 在 1.0 之前，API 仍有可能根据反馈做出调整
- 如果你打算用于生产环境，建议锁定版本，并在升级前关注变更记录

我们选择尽早把它放出来，是希望它能在真实的使用反馈中成长，而不是关起门来做到“完美”再发布。

## 一起参与 {#contributing}

如果你在使用中遇到问题，或者发现某个组件与 PC 端的行为不一致却没有写在文档里，欢迎通过 [Issue](https://github.com/antdv-next/antdv-next-mobile/issues) 告诉我们；也非常欢迎直接提交 [PR](https://github.com/antdv-next/antdv-next-mobile/pulls)。

- 文档：[m.antdv-next.com](https://m.antdv-next.com)
- 仓库：[antdv-next/antdv-next-mobile](https://github.com/antdv-next/antdv-next-mobile)
- npm：[@antdv-next/mobile](https://www.npmjs.com/package/@antdv-next/mobile)

和 Antdv Next 一样，它属于社区，也将长期服务于社区。
