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

## 版本兼容

`@antdv-next/unocss` 跟随 `antdv-next` 一起演进，请按下表选择匹配的版本：

| `antdv-next` 版本 | `@antdv-next/unocss` 版本 | 说明 |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | 当前推荐版本。padding / margin token 与 1.3.0 对齐（移除了 `p-xxl`、`p-xxxl`、`m-xxxl`），并新增了 `primary-text`、`success-bg-hover`、`text-placeholder`、`bg-solid` 等 token；同时引入命名空间安全模式（`bg-ant-primary`） |
| `<1.3.0` | `<1.1.0` | 1.3.0 之前的 antdv 使用的是旧的 spacing token，必须搭配 `@antdv-next/unocss@<1.1.0`，否则会出现 `p-xxl`、`m-xxxl` 等不存在的 CSS 变量 |

> 升级 antdv-next 到 1.3.0 时，请同时升级 `@antdv-next/unocss` 到 `>=1.1.0`；反过来如果你的 antdv-next 仍在 1.2.x 以下，请固定 `@antdv-next/unocss` 在 1.0.x。

## 包信息

- 包名：`@antdv-next/unocss`
- `peerDependencies`：`unocss >= 66.0.0`

## 安装

搭配 antdv-next 1.3.0+：

```bash
pnpm add -D unocss @antdv-next/unocss@^1.1.0
```

搭配 antdv-next 1.2.x 及更早：

```bash
pnpm add -D unocss @antdv-next/unocss@~1.0
```

## 什么时候用它

适合以下场景：

- 你已经在项目里使用 UnoCSS
- 你希望复用 UnoCSS / Wind 风格的工具类习惯
- 你希望颜色、圆角、阴影、字体等能力直接跟随 `antdv-next` 的 CSS 变量
- 你需要运行时主题切换，而不是构建时写死主题值

如果你正在使用 Tailwind CSS，可以查看 [Tailwind CSS](/docs/vue/tailwindcss) 文档。

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
      prefix: 'a',                  // class 前缀，默认 'a'
      allowPrefixedUtilities: true, // 保留 a-* 工具类，默认 true
      allowUnprefixed: true,        // 保留 bg-primary 这类旧裸类，默认 true
      antPrefix: 'ant',             // CSS 变量前缀，默认 'ant'
      tokenPrefix: 'ant',           // namespace 安全前缀，默认 'ant'，置空可关闭
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
      allowPrefixedUtilities: true,
      allowUnprefixed: true,
      antPrefix: 'ant',
      tokenPrefix: 'ant',
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

## 三种工具类写法（1.1.0 起）

两个预设默认同时发出三类工具类，可以独立开关：

| 模式 | 示例 | 控制项 | 适用场景 |
| --- | --- | --- | --- |
| **Prefixed（稳定推荐）** | `a-bg-primary`、`a-p-lg` | `allowPrefixedUtilities`（默认 `true`） | 大多数项目；明确隔离 antdv 工具类 |
| **Namespace-safe（推荐替代旧裸写法）** | `bg-ant-primary`、`p-ant-lg` | `tokenPrefix`（默认 `'ant'`，置空关闭） | 想用短类名但要避免污染 UnoCSS 原生 token |
| **Legacy bare（兼容老用法）** | `bg-primary`、`p-lg` | `allowUnprefixed`（默认 `true`，下个 major 默认 `false`） | 仅存量项目 |

示例：

```vue
<template>
  <!-- 稳定的前缀 API -->
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    带 a- 前缀的写法
  </div>

  <!-- namespace 安全 API（推荐） -->
  <div class="bg-ant-primary color-ant-white p-ant-lg rounded-ant-lg shadow-ant-card">
    namespace 安全写法
  </div>

  <!-- 旧的裸写法（仍可用，但有冲突风险） -->
  <div class="bg-primary color-white p-lg rounded-lg shadow-card">
    不带前缀的旧写法
  </div>
</template>
```

需要注意：

- 文本颜色使用的是 `color-primary` 或 `c-primary`（namespace 安全模式下是 `color-ant-primary` / `c-ant-primary`）
- `text-*` 主要表示字号，例如 `text-lg`、`text-h1`（namespace 安全模式下是 `text-ant-lg`）

如果你希望只允许 `a-*` 和 `*-ant-*` 写法、关闭旧的裸类：

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      allowUnprefixed: false, // 关闭 bg-primary / text-sm 等旧裸类
      // allowPrefixedUtilities: true 与 tokenPrefix: 'ant' 仍然生效
    }),
  ],
})
```

> `allowUnprefixed: false` 只关闭旧裸写法，**不会改变** `theme.colors.primary` 等键的命名。`a-bg-primary` 与 `bg-ant-primary` 仍然可用。

## 间距 token（与 antdv 1.3.0 对齐）

- Padding：`xxs`、`xs`、`sm`、`md`、`lg`、`xl`
- Margin：`xxs`、`xs`、`sm`、`md`、`lg`、`xl`、`xxl`

> 1.1.0 起 `p-xxl`、`p-xxxl`、`m-xxxl` 不再生成，因为 antdv 1.3.0 已移除对应 CSS 变量。如果你仍在 1.2.x 及之前的 antdv-next，请固定 `@antdv-next/unocss` 在 1.0.x。

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

常见工具类（每个都有 `a-*` / `*-ant-*` / 裸写三种形态）：

- 颜色：`color-*`、`bg-*`、`border-*`（以及 `b-*`、方向性 `bt-` / `bx-` 等）
- 间距：`m-*`、`p-*`、`mx-*`、`py-*`
- 圆角：`rounded-*`、`rd-*`
- 阴影：`shadow-*`
- 文本：`text-*`

## 常用类名示例

### 颜色与背景

| 稳定前缀 | namespace 安全 | 说明 |
| --- | --- | --- |
| `a-bg-primary` | `bg-ant-primary` | 主色背景 |
| `a-bg-container` | `bg-ant-container` | 容器背景色 |
| `a-bg-success-bg` | `bg-ant-success-bg` | 成功色浅背景 |
| `a-color-primary` | `color-ant-primary` | 主色文字 |
| `a-color-text` | `color-ant-text` | 默认文字色 |
| `a-color-text-secondary` | `color-ant-text-secondary` | 次级文字 |
| `a-border-border` | `border-ant-border` | 默认边框色 |
| `a-border-t-primary` | `border-t-ant-primary` | 顶部主色边框 |

### 间距与布局

| 稳定前缀 | namespace 安全 | 说明 |
| --- | --- | --- |
| `a-p-lg` | `p-ant-lg` | 24px 内边距 |
| `a-px-md` | `px-ant-md` | 水平 20px 内边距 |
| `a-py-sm` | `py-ant-sm` | 垂直 12px 内边距 |
| `a-mt-sm` | `mt-ant-sm` | 顶部 12px 外边距 |
| `a-mx-lg` | `mx-ant-lg` | 水平 24px 外边距 |
| `a-my-xs` | `my-ant-xs` | 垂直 8px 外边距 |

### 圆角、阴影与文字

| 稳定前缀 | namespace 安全 | 说明 |
| --- | --- | --- |
| `a-rounded-sm` | `rounded-ant-sm` | 小圆角 |
| `a-rounded-lg` | `rounded-ant-lg` | 大圆角 |
| `a-rounded` | `rounded-ant` | 默认圆角 |
| `a-shadow-card` | `shadow-ant-card` | 卡片阴影 |
| `a-shadow` | `shadow-ant` | 默认阴影 |
| `a-text-lg` | `text-ant-lg` | 大号文字 |
| `a-text-h1` | `text-ant-h1` | 一级标题字号 |

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

## 主题与变量说明

这个预设本质上是把工具类映射到 Ant Design 的 CSS 变量，例如颜色、圆角、阴影和字号都会跟随当前主题变量变化。

因此在使用时，建议确保应用已经正确接入 `ConfigProvider`，并按需结合 [定制主题](/docs/vue/customize-theme) 调整设计 Token。

## 注意事项

- 该预设主要扩展 `m-*` / `p-*` 相关类，不会覆盖 UnoCSS 全局 spacing 规则（`w-*`、`max-w-*`、`gap-*` 等保持 UnoCSS 默认）。
- `prefix` 默认是 `a`，生成的类名通常是 `a-bg-primary`、`a-p-lg` 这种形式。
- `allowUnprefixed` 默认是 `true`，但在下一个 major 中会改为 `false`，推荐尽早迁移到 `a-*` 或 `*-ant-*` 写法。
- `allowUnprefixed: false` 仅关闭裸写法，**不会改变** theme key 结构（`colors.primary` 始终是 `colors.primary`）。
- `antPrefix` 默认是 `ant`，如果你自定义了 `prefixCls` 或 CSS 变量前缀，需要同步调整这里的配置。
- `tokenPrefix` 默认是 `ant`，可改为其他值（如 `antd`）来定制 namespace；置空字符串则关闭 namespace 安全模式。
