---
title: UnoCSS
---

首先需要在 `App.vue` 的入口处增加一层 `a-app` 包裹，确保组件运行时有父级样式容器：

```vue
<template>
  <a-app>
    <router-view />
  </a-app>
</template>
```

如果你希望在 `antdv-next` 项目里使用原子化工具类，并且让这些工具类直接映射到 Ant Design 的 CSS 变量体系，可以使用 `@antdv-next/unocss`。

这个包提供了面向 Ant Design 设计 Token 的 UnoCSS 预设，适合希望继续使用 UnoCSS / Wind 风格语法，同时保持运行时主题切换能力的项目。

## 包信息

- 包名：`@antdv-next/unocss`
- `peerDependencies`：`unocss >= 66.0.0`

## 安装

```bash
pnpm add -D unocss @antdv-next/unocss
```

## 什么时候用它

适合以下场景：

- 你已经在项目里使用 UnoCSS
- 你希望复用 UnoCSS / Wind 风格的工具类习惯
- 你希望颜色、圆角、阴影、字体等能力直接跟随 `antdv-next` 的 CSS 变量
- 你需要运行时主题切换，而不是构建时写死主题值

如果你正在使用 Tailwind CSS，也可以查看 [Tailwind CSS](/docs/vue/tailwindcss) 文档。

## 提供的两个预设

### `presetAntd`

默认预设，兼容 UnoCSS Wind3 风格，适用于大多数 UnoCSS 项目。

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      allowUnprefixed: true,
      antPrefix: 'ant',
    }),
  ],
})
```

主题键名：

- `colors`
- `borderRadius`
- `fontSize`
- `boxShadow`

### `presetAntdTailwind4`

如果你希望保留 UnoCSS，但更偏向 Tailwind CSS v4 的主题键名结构，可以使用这个预设。

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntdTailwind4 } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntdTailwind4({
      prefix: 'a',
      allowUnprefixed: true,
      antPrefix: 'ant',
    }),
  ],
})
```

主题键名：

- `colors`
- `radius`
- `text`
- `shadow`
- `defaults`

## 如何选择

### 选择 `presetAntd`

- 你已经有一套 UnoCSS 配置
- 你更希望保持标准 UnoCSS 主题结构
- 你在配合 Wind3、Attributify 等预设使用

### 选择 `presetAntdTailwind4`

- 你更习惯 Tailwind CSS v4 的主题命名
- 你正在从 Tailwind v4 迁移到 UnoCSS，或者两套方案混合使用
- 你希望使用 `radius`、`shadow`、`text` 这类键名

## 默认支持带前缀和不带前缀写法

两个预设默认都支持：

- 带前缀写法：`a-bg-primary`、`a-p-lg`、`a-rounded-lg`
- 不带前缀写法：`bg-primary`、`p-lg`、`rounded-lg`

例如：

```vue
<template>
  <div class="bg-primary color-white p-lg rounded-lg shadow-card">
    不带 a- 前缀的写法
  </div>

  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    带 a- 前缀的写法
  </div>
</template>
```

需要注意的是：

- 文本颜色使用的是 `color-primary` 或 `c-primary`
- `text-*` 在这里主要表示字号，例如 `text-lg`、`text-h1`
- 所以无前缀时应写 `color-primary`，而不是 `text-primary`

如果你希望只允许 `a-` 开头的类名生效，可以显式关闭无前缀支持：

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      allowUnprefixed: false,
      antPrefix: 'ant',
    }),
  ],
})
```

关闭后：

- `a-bg-primary`、`a-p-lg`、`a-rounded-lg` 仍然可用
- `bg-primary`、`p-lg`、`rounded-lg`、`color-primary` 将不再生效

## 工具类示例

```vue
<template>
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    主色卡片
  </div>

  <div class="a-bg-container a-color-text a-px-md a-py-sm a-border-border a-rounded-sm">
    容器内容
  </div>

  <div class="a-text-lg a-color-primary a-mt-sm">
    标题文本
  </div>
</template>
```

常见工具类包括：

- 颜色：`a-color-*`、`a-bg-*`、`a-border-*`
- 间距：`a-m-*`、`a-p-*`、`a-mx-*`、`a-py-*`
- 圆角：`a-rounded-*`、`a-rd-*`
- 阴影：`a-shadow-*`
- 文本：`a-text-*`

当 `allowUnprefixed: true` 时，上述大部分类名也支持无前缀写法。

## 常用类名示例

### 颜色与背景

| 类名 | 说明 | 用途 |
| --- | --- | --- |
| `a-bg-primary` / `bg-primary` | 主色背景 | 用于主按钮、重点卡片、强调区域 |
| `a-bg-container` | 容器背景色 | 用于卡片、面板、表单容器 |
| `a-color-text` | 主文本颜色 | 用于默认正文内容 |
| `a-color-primary` / `color-primary` | 主色文字 | 用于重点文字、链接、强调标题 |
| `a-color-text-secondary` | 次级文本颜色 | 用于说明文字、辅助信息 |
| `a-border-border` | 默认边框颜色 | 用于分割线、输入框、卡片边框 |
| `a-border-t-primary` | 顶部主色边框 | 用于标题装饰、状态标识 |

### 间距与布局

| 类名 | 说明 | 用途 |
| --- | --- | --- |
| `a-p-lg` / `p-lg` | 大内边距 | 用于卡片、弹层、容器留白 |
| `a-px-md` | 水平方向中等内边距 | 用于按钮、标签、输入框 |
| `a-py-sm` | 垂直方向小内边距 | 用于紧凑型块元素 |
| `a-mt-sm` | 顶部小外边距 | 用于上下模块间距 |
| `a-mx-lg` | 水平方向大外边距 | 用于左右留白调整 |
| `a-my-xs` | 垂直方向超小外边距 | 用于紧凑列表项 |

### 圆角、阴影与文字

| 类名 | 说明 | 用途 |
| --- | --- | --- |
| `a-rounded-sm` | 小圆角 | 用于输入框、标签、轻量卡片 |
| `a-rounded-lg` / `rounded-lg` | 大圆角 | 用于面板、卡片、弹窗容器 |
| `a-shadow-card` / `shadow-card` | 卡片阴影 | 用于提升卡片层级感 |
| `a-shadow-sec` | 次级阴影 | 用于较轻的浮层效果 |
| `a-text-lg` / `text-lg` | 大号文字 | 用于小标题或重点文案 |
| `a-text-h1` / `text-h1` | 一级标题字号 | 用于页面主标题 |

## 主题与变量说明

这个预设本质上是把工具类映射到 Ant Design 的 CSS 变量，例如颜色、圆角、阴影和字号都会跟随当前主题变量变化。

因此在使用时，建议确保应用已经正确接入 `ConfigProvider`，并按需结合 [定制主题](/docs/vue/customize-theme) 调整设计 Token。

## 注意事项

- 该预设主要扩展 `m-*` / `p-*` 相关类，不会覆盖 UnoCSS 全局 spacing 规则。
- `prefix` 默认是 `a`，所以生成的类名通常是 `a-bg-primary`、`a-p-lg` 这种形式。
- `allowUnprefixed` 默认是 `true`，因此 `bg-primary`、`p-lg`、`color-primary` 这类无前缀类名默认也可用；如果你希望只允许 `a-*`，可设置为 `false`。
- `antPrefix` 默认是 `ant`，如果你自定义了 `prefixCls` 或 CSS 变量前缀，需要同步调整这里的配置。
