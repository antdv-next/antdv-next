---
title: Tailwind CSS
---

首先需要在 `App.vue` 的入口处增加一层 `a-app` 包裹，确保组件运行时有父级样式容器：

```vue
<template>
  <a-app>
    <router-view />
  </a-app>
</template>
```

如果你希望在 `antdv-next` 项目中继续使用 Tailwind CSS，同时让工具类和 Ant Design 的设计 Token 保持一致，可以使用 `@antdv-next/tailwind`。

这个插件会把 Ant Design 的 CSS 变量映射到 Tailwind 的主题系统中，让你在使用 `bg-primary`、`shadow-card`、`text-h1` 这类类名时，仍然能跟随 `antdv-next` 的运行时主题变化。

## 版本兼容

`@antdv-next/tailwind` 跟随 `antdv-next` 一起演进，请按下表选择匹配的版本：

| `antdv-next` 版本 | `@antdv-next/tailwind` 版本 | 说明 |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | 当前推荐版本。padding / margin token 与 1.3.0 对齐（移除了 `p-xxl`、`p-xxxl`、`m-xxxl`），并新增 `primary-text`、`success-bg-hover`、`text-placeholder`、`bg-solid` 等 token；同时新增 v4 命名空间安全入口 `compat.css` |
| `<1.3.0` | `<1.1.0` | 1.3.0 之前的 antdv 使用的是旧的 spacing token，必须搭配 `@antdv-next/tailwind@<1.1.0`，否则会引用到已不存在的 CSS 变量 |

> 升级 antdv-next 到 1.3.0 时，请同时升级 `@antdv-next/tailwind` 到 `>=1.1.0`；反过来如果你的 antdv-next 仍在 1.2.x 以下，请固定 `@antdv-next/tailwind` 在 1.0.x。

## 包信息

- 包名：`@antdv-next/tailwind`
- `peerDependencies`：`tailwindcss >= 3.0.0`

## 安装

搭配 antdv-next 1.3.0+：

```bash
pnpm add -D tailwindcss @antdv-next/tailwind@^1.1.0
```

搭配 antdv-next 1.2.x 及更早：

```bash
pnpm add -D tailwindcss @antdv-next/tailwind@~1.0
```

## 什么时候用它

适合以下场景：

- 你的项目已经在使用 Tailwind CSS
- 你希望工具类与 Ant Design 设计 Token 对齐
- 你希望保留 Tailwind 的开发体验，同时接入 `antdv-next` 主题变量
- 你需要运行时主题切换，而不是把颜色写死在构建产物里

如果你更偏向 UnoCSS 方案，可以查看 [UnoCSS](/docs/vue/unocss) 文档。

## Tailwind CSS v4（推荐）

Tailwind CSS v4 通过 `@theme` 机制接入主题变量。`@antdv-next/tailwind` 在 1.1.0 起提供 **两个并存入口**，你可以按项目需要二选一：

| 入口 | 工具类示例 | 适用场景 |
| --- | --- | --- |
| `theme.css`（经典） | `bg-primary`、`p-lg`、`text-lg`、`shadow-card` | 现有项目；接受 antdv token 直接占用 Tailwind 原生 utility |
| `compat.css`（**推荐**） | `bg-ant-primary`、`p-ant-lg`、`text-ant-lg`、`shadow-ant-card`（再加可选的 `a-bg-primary` 等前缀简写） | 新项目；避免与 Tailwind 内置 token / 业务自定义 token 冲突 |

> 详细背景参考 [css-plugin Issue #7 (RFC)](https://github.com/antdv-next/css-plugin/issues/7)。

### 方式 1：直接引入主题文件

```css
@import "tailwindcss";

/* 二选一 —— 经典入口 */
@import "@antdv-next/tailwind/theme.css";

/* 或者 —— 命名空间安全入口（推荐） */
@import "@antdv-next/tailwind/compat.css";
```

### 方式 2：动态生成主题 CSS

如果你需要自定义 CSS 变量前缀或命名空间，可以使用 `v4` 导出的生成函数：

```ts
import {
  generateCompatThemeCSS,
  generateThemeCSS,
} from '@antdv-next/tailwind/v4'

// 经典入口（默认 antPrefix='ant'）
const css = generateThemeCSS({
  antPrefix: 'my-app',
})

// 命名空间安全入口
const compatCss = generateCompatThemeCSS({
  antPrefix: 'ant',             // antdv CSS 变量前缀
  tokenPrefix: 'ant',           // 输出 --color-ant-primary、@utility p-ant-lg
  prefix: 'a',                  // 额外输出 @utility a-bg-primary 等简写
  allowPrefixedUtilities: true, // 是否生成上述前缀简写
})
```

### compat.css 配置说明

- `antPrefix`：antdv-next CSS 变量前缀（对应 `ConfigProvider` 的 `prefixCls`）
- `tokenPrefix`：注入 Tailwind v4 theme token 的命名空间，例如 `--color-ant-primary`、`--padding-ant-lg`、`--text-ant-lg`。同时会生成 `@utility p-ant-lg { padding: var(--padding-ant-lg) }` 这类安全的方向性 utility，避免覆盖 Tailwind 原生 `p-*`
- `prefix`：额外的前缀 utility 写法（如 `a-bg-primary`、`a-p-lg`）。这些 utility 直接绑定到 antdv 变量，不依赖 `tokenPrefix`
- `allowPrefixedUtilities`：是否生成上述前缀 utility。关闭后仅保留 `@theme inline` 中的 namespace token

## Tailwind CSS v3

如果你仍在使用 Tailwind CSS v3，可以通过插件方式接入。

### 基础配置

```ts
import antdPlugin from '@antdv-next/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [antdPlugin],
}
```

### 自定义配置

```ts
import { createAntdPlugin } from '@antdv-next/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [
    createAntdPlugin({
      antPrefix: 'ant',
    }),
  ],
}
```

## 使用示例

```vue
<template>
  <!-- 经典 theme.css 写法 -->
  <div class="bg-primary text-white p-lg rounded-lg shadow-card">
    <h1 class="text-h1 text-primary">经典 theme.css</h1>
    <p class="text-text-secondary mt-sm">
      使用 Tailwind CSS 工具类和 Ant Design 设计变量
    </p>
  </div>

  <!-- compat.css 推荐写法（命名空间安全） -->
  <div class="bg-ant-primary text-ant-light-solid p-ant-lg rounded-ant-lg shadow-ant-card">
    <h1 class="text-ant-h1 color-ant-primary">namespace 安全</h1>
    <p class="color-ant-text-secondary mt-ant-sm">
      不会与 Tailwind 内置 token 冲突
    </p>
  </div>

  <!-- compat.css 还会额外发出 a-* 前缀简写 -->
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    <h1 class="a-text-h1">前缀简写</h1>
  </div>
</template>
```

## Tailwind v4 工具类对照

| 类别 | 经典 `theme.css` | 推荐 `compat.css` | 简写 |
| --- | --- | --- | --- |
| 颜色 | `bg-primary`、`text-blue-5` | `bg-ant-primary`、`text-ant-blue-5` | `a-bg-primary`、`a-c-primary` |
| Padding | `p-lg`、`px-sm` | `p-ant-lg`、`px-ant-sm` | `a-p-lg`、`a-px-sm` |
| Margin | `m-lg`、`my-sm` | `m-ant-lg`、`my-ant-sm` | `a-m-lg`、`a-my-sm` |
| Radius | `rounded-lg` | `rounded-ant-lg` | `a-rounded-lg`、`a-rd-lg` |
| Font size | `text-h1` | `text-ant-h1` | `a-text-h1` |
| Shadow | `shadow-card` | `shadow-ant-card` | `a-shadow-card` |

## 常用类名示例

### 颜色与背景

| 经典 `theme.css` | namespace 安全 `compat.css` | 说明 |
| --- | --- | --- |
| `bg-primary` | `bg-ant-primary` | 主色背景 |
| `text-primary` | `color-ant-primary` | 主色文字 |
| `bg-success` | `bg-ant-success` | 成功状态背景 |
| `text-text-secondary` | `color-ant-text-secondary` | 次级文本颜色 |
| `bg-container` | `bg-ant-container` | 容器背景色 |
| `border-border` | `border-ant-border` | 默认边框颜色 |

### 间距与布局

| 经典 | namespace 安全 | 说明 |
| --- | --- | --- |
| `p-lg` | `p-ant-lg` | 大内边距 |
| `px-md` | `px-ant-md` | 水平中等内边距 |
| `py-sm` | `py-ant-sm` | 垂直小内边距 |
| `m-md` | `m-ant-md` | 中等外边距 |
| `mt-sm` | `mt-ant-sm` | 顶部小外边距 |
| `rounded-lg` | `rounded-ant-lg` | 大圆角 |

### 文字与阴影

| 经典 | namespace 安全 | 说明 |
| --- | --- | --- |
| `text-h1` | `text-ant-h1` | 一级标题字号 |
| `text-lg` | `text-ant-lg` | 大号文字 |
| `text-sm` | `text-ant-sm` | 小号文字 |
| `shadow-card` | `shadow-ant-card` | 卡片阴影 |
| `shadow-sec` | `shadow-ant-sec` | 次级阴影 |
| `shadow-ter` | `shadow-ant-ter` | 第三级阴影 |

## 间距 token（与 antdv 1.3.0 对齐）

- Padding：`xxs`、`xs`、`sm`、`md`、`lg`、`xl`
- Margin：`xxs`、`xs`、`sm`、`md`、`lg`、`xl`、`xxl`

> 1.1.0 起 `p-xxl`、`p-xxxl`、`m-xxxl` 不再生成，因为 antdv 1.3.0 已移除对应 CSS 变量。如果你仍在 1.2.x 及之前的 antdv-next，请固定 `@antdv-next/tailwind` 在 1.0.x。

## 1.3.0 新增的 token（1.1.0 起可用）

完整的语义 token 都已对齐 antdv 1.3.0：

- Primary / Success / Warning / Error / Info 每个语义色都提供 `*-bg`、`*-bg-hover`、`*-border`、`*-border-hover`、`*-hover`、`*`、`*-active`、`*-text`、`*-text-hover`、`*-text-active` 十档
- Error 独有：`error-bg-filled-hover`、`error-bg-active`、`error-affix`
- Warning 独有：`warning-affix`
- 文字：`text-placeholder`、`text-disabled`、`text-heading`、`text-label`、`text-description`、`text-light-solid`
- 填充：`fill-content`、`fill-content-hover`、`fill-alter`
- 背景：`container-disabled`、`spotlight`、`blur`、`solid`、`solid-hover`、`solid-active`
- 边框：`border-disabled`、`border-bg`
- 图标：`icon`、`icon-hover`
- 其它：`highlight`、`white`

## 与主题系统的关系

该插件依赖 Ant Design 的 CSS 变量体系，所以建议确保应用已正确包裹 `ConfigProvider`，并按需结合 [定制主题](/docs/vue/customize-theme) 调整 Token。

```vue
<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'
</script>

<template>
  <ConfigProvider>
    <RouterView />
  </ConfigProvider>
</template>
```

## 注意事项

- v4 推荐直接引入 `compat.css`：命名空间安全、不与 Tailwind 内置 utility 冲突；如需迁移老项目可暂时使用 `theme.css`。
- 1.1.0 起 `theme.css` 已移除 `p-xxl` / `p-xxxl` / `m-xxxl`，以匹配 antdv 1.3.0 的真实 CSS 变量。
- v3 和 v4 都不会覆盖 Tailwind 全局 spacing 规则，所以 `gap-*`、`max-w-*` 等类仍保持 Tailwind 默认行为。
- 如果你修改了 CSS 变量前缀，需要同步配置 `antPrefix`。
- `compat.css` 的命名空间默认是 `ant`（即 `bg-ant-primary`）。可通过 `generateCompatThemeCSS({ tokenPrefix: 'antd' })` 改为 `antd`，相应工具类变为 `bg-antd-primary`。
