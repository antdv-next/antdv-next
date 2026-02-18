---
title: Nuxt
---

`@antdv-next/nuxt` is the official Nuxt module for `antdv-next`.

## Version Requirements

- Nuxt >= 4.0.0
- Vue >= 3.5.0
- antdv-next >= 1.0.4
- @antdv-next/icons >= 1.0.1

## Installation

```shell
npx nuxi@latest module add @antdv-next/nuxt
```

Or install dependencies manually:

```shell
# via pnpm
pnpm add -D @antdv-next/nuxt antdv-next @antdv-next/icons

# via npm
npm i -D @antdv-next/nuxt antdv-next @antdv-next/icons

# via yarn
yarn add -D @antdv-next/nuxt antdv-next @antdv-next/icons
```

## Configuration

```ts
export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  antd: {
    icon: true,
  },
})
```

The module config key is `antd`.

## Usage

```vue
<template>
  <a-button type="primary">Primary</a-button>
  <HomeOutlined />
</template>
```

By default, components are registered with prefix `A`, for example `AButton`, `ATable`, and `AQrcode`.

## Styles

Add reset styles:

```ts
export default defineNuxtConfig({
  css: ['antdv-next/dist/reset.css'],
})
```

If you use zero-runtime theme mode (recommended), also include:

```ts
export default defineNuxtConfig({
  css: [
    'antdv-next/dist/reset.css',
    'antdv-next/dist/antd.css',
  ],
})
```

:::warning Note

If `nuxt devtools` is enabled, style loading in development may become slower. If you encounter slow style loading or temporarily unclickable UI, try disabling `nuxt devtools`, or wait until loading is finished in the console before interacting.

This does not affect normal precompiled development flow, and it does not affect production builds.

:::

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `boolean` | `false` | Enable auto-registration for `@antdv-next/icons`. |
| `prefix` | `string` | `'A'` | Prefix for all auto-registered components. |
| `include` | `ComponentName[]` | `undefined` | Only register listed components. Higher priority than `exclude`. |
| `exclude` | `ComponentName[]` | `undefined` | Exclude listed components when `include` is not set. |
| `includeIcons` | `IconName[]` | `undefined` | Only register listed icons. Higher priority than `excludeIcons`. |
| `excludeIcons` | `IconName[]` | `undefined` | Exclude listed icons when `includeIcons` is not set. |

Notes:

- `includeIcons` and `excludeIcons` work only when `icon` is enabled.
- `ComponentName` and `IconName` are exported from the module type definitions.

## Full Example

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
