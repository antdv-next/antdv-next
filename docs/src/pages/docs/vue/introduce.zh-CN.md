---
title: Ant Design of Vue
---

`antdv-next` 是基于 Ant Design 设计体系的 Vue 实现，提供了丰富的高质量 Vue 组件，帮助开发者快速构建现代化的 Web 应用。

<div class="pic-plus">
  <img width="150" draggable="false" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"/>
  <span>+</span>
  <img width="150" draggable="false" src="../../../assets/vue.svg"/>
  <span>=</span>
  <img width="190" draggable="false" src="../../../assets/antdv-next.svg"/>
</div>

---

## ✨ 特性 {#features}

- 🌈 提炼自企业级中后台产品的交互语言和视觉风格。
- 📦 开箱即用的高质量 Vue3 组件。
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。
- ⚙️ 共享<a href="https://ant.design/docs/resources-cn" target="_blank" rel="noopener noreferrer"> Ant Design of React </a>设计资源体系。
- 🌍 数十个国际化语言支持。
- 🎨 深入每个细节的主题定制能力。

## 兼容环境 {#environment-support}

- 现代浏览器
- 支持服务端渲染。
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

> `vue3` 之后不再支持 IE8。 `antdv-next` 默认不支持 IE。推荐从`vue@3.5.x`版本开始使。

## 版本 {#version}

- 稳定版：[![npm package](https://img.shields.io/npm/v/antdv-next.svg?style=flat-square)](https://www.npmjs.org/package/antdv-next)

## 安装 {#installation}

### 使用 npm 或 yarn 或 pnpm 或 bun 安装 {#using-npm-or-yarn-or-pnpm-or-bun}

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

<InstallDependencies npm='$ npm install antdv-next --save' yarn='$ yarn add antdv-next' pnpm='$ pnpm install antdv-next --save' bun='$ bun add antdv-next'></InstallDependencies>

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入 {#import-in-browser}

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

我们在 npm 发布包内的 dist 目录下提供了 `antd.js`  和 `reset.css`。你也可以通过 <!--[![CDNJS](https://img.shields.io/cdnjs/v/antdv-next.svg?style=flat-square)](https://cdnjs.com/libraries/antdv-next)，--> [![](https://data.jsdelivr.com/v1/package/npm/antdv-next/badge)](https://www.jsdelivr.com/package/npm/antdv-next) 或 [UNPKG](https://unpkg.com/antdv-next/dist/) 进行下载。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`antd.js`  依赖 `vue`、`dayjs`，请确保提前引入这些文件。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>浏览器引入 Demo</title>
    <link href="https://cdn.jsdelivr.net/npm/antdv-next@1.0.5/dist/reset.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/antdv-next@1.0.5/dist/antd.css" rel="stylesheet" />
  </head>

  <body>
    <div id="app">
      {{msg}}
      <a-button type="primary">点击</a-button>
    </div>

    <script>window.process = { env: { NODE_ENV: 'production' } }</script>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.global.js"></script>
    <!-- dayjs + 所有依赖插件必须在 antdv-next 之前加载 -->
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/advancedFormat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/customParseFormat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/localeData.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/weekday.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/weekOfYear.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/plugin/weekYear.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/antdv-next@1.0.5/dist/antd.js"></script>
    <script>
      const { createApp } = Vue;
      const app = createApp({
        setup() {
          return {
            msg: "hello antdv-next",
          };
        },
      });
      app.use(antd.default);
      app.mount("#app");
    </script>
  </body>
</html>
```

## 示例 {#usage}

```vue
<template>
  <a-date-picker />
</template>
```

### 按需加载 {#use-modularized-antdv-next}

`antdv-next` 是一个完全的 Pure ESM 的项目，默认支持 tree shaking。

### TypeScript

`antdv-next` 使用 TypeScript 进行书写并提供了完整的定义文件。

## 链接 {#links}

- [首页](/index-cn)
- [所有组件](/components/overview-cn)
