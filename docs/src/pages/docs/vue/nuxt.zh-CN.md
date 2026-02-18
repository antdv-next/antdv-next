---
title: Nuxt支持
---

`@antdv-next/nuxt` 是 `antdv-next` 官方提供的 Nuxt 模块。

## 版本要求

- Nuxt >= 4.0.0
- Vue >= 3.5.0
- antdv-next >= 1.0.4
- @antdv-next/icons >= 1.0.1

## 安装

```shell
npx nuxi@latest module add @antdv-next/nuxt
```

或手动安装依赖：

```shell
# via pnpm
pnpm add -D @antdv-next/nuxt antdv-next @antdv-next/icons

# via npm
npm i -D @antdv-next/nuxt antdv-next @antdv-next/icons

# via yarn
yarn add -D @antdv-next/nuxt antdv-next @antdv-next/icons
```

## 配置

```ts
export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  antd: {
    icon: true,
  },
})
```

模块的配置键是 `antd`。

## 使用

```vue
<template>
  <a-button type="primary">Primary</a-button>
  <HomeOutlined />
</template>
```

默认情况下，组件会以 `A` 前缀注册，比如 `AButton`、`ATable`、`AQrcode`。

## 样式

引入基础重置样式：

```ts
export default defineNuxtConfig({
  css: ['antdv-next/dist/reset.css'],
})
```

如果你使用 zero-runtime 主题模式(推荐模式)，还需要引入：

```ts
export default defineNuxtConfig({
  css: [
    'antdv-next/dist/reset.css',
    'antdv-next/dist/antd.css',
  ],
})
```
:::warning 需要注意的是
如果开启了 `nuxt devtools`，开发模式下的样式加载可能会变慢。  
如果你遇到样式加载过慢或页面暂时无法正常点击的情况，请先尝试关闭 `nuxt devtools`或等待 `devtools` 加载完成后再操作。

该问题不会影响正常预编译开发流程，也不会影响生产环境。

:::

## 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `boolean` | `false` | 是否自动注册 `@antdv-next/icons` 图标组件。 |
| `prefix` | `string` | `'A'` | 自动注册组件的统一前缀。 |
| `include` | `ComponentName[]` | `undefined` | 仅注册列表中的组件，优先级高于 `exclude`。 |
| `exclude` | `ComponentName[]` | `undefined` | 当未设置 `include` 时，排除列表中的组件。 |
| `includeIcons` | `IconName[]` | `undefined` | 仅注册列表中的图标，优先级高于 `excludeIcons`。 |
| `excludeIcons` | `IconName[]` | `undefined` | 当未设置 `includeIcons` 时，排除列表中的图标。 |

说明：

- `includeIcons` 和 `excludeIcons` 仅在 `icon` 开启时生效。
- `ComponentName` 和 `IconName` 类型可从模块类型定义中获取。

## 完整示例

```ts
export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  css: ['antdv-next/dist/reset.css'],
  antd: {
    prefix: 'A',
    icon: true,
    include: ['Button', 'Table', 'QRCode'],
    includeIcons: ['HomeOutlined', 'SearchOutlined'],
  },
})
```
