---
title: Design.md
tag: New
---

`design.md` 是一份遵循 [google-labs-code/design.md](https://github.com/google-labs-code/design.md) 规范的设计语言描述文件。它面向 AI 设计工具(如 Figma Make、Google Stitch),用结构化方式描述 antdv-next 默认 Light 主题的视觉语言、组件范式和主题 Token,让 AI 生成的 UI 能直接匹配组件库风格。

## 文件来源

`design.md` 由 [`@antdv-next/cli`](https://github.com/antdv-next/cli) 工具链从组件库主题 Token 自动生成(`scripts/tokens.ts` 提取 Token,`antdv design.md` 输出文件)。CLI 与本站发布的文件共用同一份权威版本。

## 获取方式

文件可通过以下途径获取:

| 来源 | 说明 |
| --- | --- |
| [design.md](https://antdv-next.com/design.md) | 已发布的原始文件,AI 工具可直接通过 URL 读取 |
| `antdv design.md` | CLI 命令输出相同内容(见 [CLI 指南](/docs/vue/cli-cn)) |
| [llms.txt](https://antdv-next.com/llms.txt) | 导航文件,包含 design.md 与所有组件文档的链接 |

## Design Token

`design.md` 的 front matter 携带机器可读的 Token。默认 Light 主题的关键值:

### 颜色

| Token | 值 | 用途 |
| --- | --- | --- |
| `primary` | `#1677FF` | 品牌色,用于主操作、链接、聚焦状态 |
| `success` / `warning` / `error` / `info` | `#52C41A` / `#FAAD14` / `#FF4D4F` / `#1677FF` | 语义反馈色 |
| `surface` | `#FFFFFF` | 容器表面(按钮、输入框、卡片) |
| `surface-container` | `#FAFAFA` | 弱化容器:表头、标签、悬停 |
| `surface-layout` | `#F5F5F5` | 页面背景 |
| `on-surface` | `#1F1F1F` | 表面主文本 |
| `on-surface-variant` | `#595959` | 次级文本 |
| `on-surface-disabled` | `#BFBFBF` | 禁用文本 |
| `outline` | `#D9D9D9` | 默认边框 |
| `outline-variant` | `#F0F0F0` | 浅色边框、分割线 |

### 字体

| Token | 值 |
| --- | --- |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif` |
| `fontFamilyCode` | `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace` |
| `display-lg` → `body-sm` | `38px` → `12px` 字号阶梯(标题 `600`,正文 `400`) |

### 圆角、间距与尺寸

| Token | 值 |
| --- | --- |
| `rounded` | `none 0 / sm 2 / md 4 / DEFAULT 6 / lg 8 / xl 16 / full 9999px` |
| `spacing.unit` | `4px` 网格(`xs 4 / sm 8 / md 16 / lg 24 / xl 32`) |
| `control-height` | `32px` 默认控件高度 |

## 组件范式

`design.md` 同时描述组件层 — Token 如何组合成可复用的 UI 模式:

- **Button(primary)** — `#1677FF` 背景、白色文字、`6px` 圆角、`32px` 高度、`0 15px` 内边距;悬停 `#4096FF`,按下 `#0958D9`
- **Button(default)** — `surface` 背景、`on-surface` 文字
- **Input / Select** — `surface` 背景、`32px` 高度、`6px` 圆角;聚焦边框 `#4096FF`
- **Card** — `surface` 背景、`8px` 圆角、`24px` 内边距
- **Modal** — `surface` 背景、`8px` 圆角、`20px 24px` 内边距
- **Tag** — `surface-container` 背景、`4px` 圆角、`0 7px` 内边距、`12px` 文字
- **Table 表头** — `surface-container` 背景、`600` 字重 `14px` 文字、`16px` 内边距
- **Menu 选中** — `#E6F4FF` 背景 + 主色文字

## 校验

`design.md` 是一份正式规范 — 可用官方 CLI 校验结构、检查 WCAG 对比度、对比 token 回归:

```bash
npx @google/design.md lint design.md
npx @google/design.md diff design.md design-v2.md
```

## 相关链接

- [LLMs.txt 指南](/docs/vue/llms-cn) — 面向 AI 工具的结构化文档
- [CLI 指南](/docs/vue/cli-cn) — `antdv design.md` 等离线命令
- [定制主题](/docs/vue/customize-theme-cn) — 主题 Token 与算法
