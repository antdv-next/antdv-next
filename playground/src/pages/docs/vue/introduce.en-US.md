---
title: Ant Design of Vue
---

Following the Ant Design specification, we developed a Vue UI library `antdv-next` that contains a set of high quality components for building rich, interactive user interfaces.

<div class="pic-plus">
  <img width="150" draggable="false" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"/>
  <span>+</span>
  <img width="150" draggable="false" src="../../../assets/vue.svg"/>
  <span>=</span>
  <img width="190" draggable="false" src="../../../assets/antdv-next.svg"/>
</div>

---

## ✨ Features

- 🌈 Enterprise-class UI designed for web applications.
- 📦 A set of high-quality Vue3 components out of the box.
- 🛡 Written in TypeScript with predictable static types.
- ⚙️ Share the <a href="https://ant.design/docs/resources-cn" target="_blank" rel="noopener noreferrer">Ant Design of React</a> design resource system.
- 🌍 Internationalization support for dozens of languages.
- 🎨 Powerful theme customization in every detail.

## Environment Support

- Modern browsers
- Server-side Rendering
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

> Dropped support of IE8 after `vue3`. `antdv-next` does not support IE by default. We recommend starting from `vue@3.5.x` version.

## Version

- Stable: [![npm package](https://img.shields.io/npm/v/antdv-next.svg?style=flat-square)](https://www.npmjs.org/package/antdv-next)

## Installation

### Using npm or yarn or pnpm or bun

**We recommend using [npm](https://www.npmjs.com/) or [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) to install**, it not only makes development easier, but also allow you to take advantage of the rich ecosystem of Javascript packages and tooling.

<InstallDependencies npm='$ npm install antdv-next --save' yarn='$ yarn add antdv-next' pnpm='$ pnpm install antdv-next --save' bun='$ bun add antdv-next'></InstallDependencies>

If you are in a bad network environment, you can try other registries and tools like [cnpm](https://github.com/cnpm/cnpm).

### Import in Browser

Add `script` and `link` tags in your browser and use the global variable `antd`.

We provide `antd.js` and `reset.css` under the `dist` folder in antdv-next's npm package. You can also download these files directly from [![CDNJS](https://img.shields.io/cdnjs/v/antdv-next.svg?style=flat-square)](https://cdnjs.com/libraries/antdv-next), [![](https://data.jsdelivr.com/v1/package/npm/antdv-next/badge)](https://www.jsdelivr.com/package/npm/antdv-next) or [UNPKG](https://unpkg.com/antdv-next/dist/).

> **We strongly discourage loading the entire files** this will add bloat to your application and make it more difficult to receive bugfixes and updates.

> Note: You should import `vue`, `dayjs` before using `antd.js`.

## Usage

```vue
<template>
  <a-date-picker />
</template>
```

### Use modularized antdv-next

`antdv-next` is a Pure ESM project and supports ES modules tree shaking by default.

### TypeScript

`antdv-next` is written in TypeScript with complete definitions.

## Links

- [Home page](/index-cn)
- [Components](/components/overview-cn)
