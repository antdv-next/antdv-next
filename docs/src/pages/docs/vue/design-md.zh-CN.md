---
title: Design.md
tag: New
---

`design.md` 是一份遵循 [google-labs-code/design.md](https://github.com/google-labs-code/design.md) 规范的设计语言描述文件。它面向 AI 设计工具(如 Figma Make、Google Stitch),用结构化方式描述 antdv-next 默认 Light 主题的视觉语言、组件范式和主题 Token,让 AI 生成的 UI 能直接匹配组件库风格。

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
| `colorPrimary` | `#1677ff` | 品牌色,用于主操作、链接、聚焦状态 |
| `colorSuccess` | `#52c41a` | 成功反馈 |
| `colorWarning` | `#faad14` | 警告反馈 |
| `colorError` | `#ff4d4f` | 错误反馈 |
| `colorInfo` | `#1677ff` | 中性信息 |
| `colorText` | `rgba(0, 0, 0, 0.88)` | 主文本 |
| `colorTextSecondary` | `rgba(0, 0, 0, 0.65)` | 次级文本 |
| `colorTextTertiary` | `rgba(0, 0, 0, 0.45)` | 三级文本、占位符 |
| `colorBorder` | `#d9d9d9` | 默认边框 |
| `colorBorderSecondary` | `#f0f0f0` | 浅色边框、分割线 |
| `colorBgContainer` | `#ffffff` | 容器背景 |
| `colorBgLayout` | `#f5f5f5` | 页面背景 |
| `colorFillSecondary` | `rgba(0, 0, 0, 0.06)` | 悬停填充 |

### 字体

| Token | 值 |
| --- | --- |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` |
| `fontFamilyCode` | `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace` |
| `fontSize` | `14px` |

### 圆角、间距与尺寸

| Token | 值 |
| --- | --- |
| `borderRadius` | `6px`(SM `4px`,LG `8px`) |
| `sizeUnit` / `sizeStep` | `4px` 间距网格 |
| `controlHeight` | `32px` 默认控件高度 |

## 组件范式

`design.md` 同时描述组件层 — Token 如何组合成可复用的 UI 模式:

- **Button(primary)** — `#1677ff` 背景、白色文字、`6px` 圆角、`32px` 高度;悬停 `#4096ff`,按下 `#0958d9`
- **Button(default)** — 白色背景、`rgba(0, 0, 0, 0.88)` 文字、`#d9d9d9` 边框
- **Input / Select** — 白色背景、`#d9d9d9` 边框、`6px` 圆角、`32px` 高度,聚焦时边框 `#1677ff` 并带 `2px` 描边
- **Card** — 白色背景、`#f0f0f0` 边框、`8px` 圆角、`24px` 内边距
- **Modal / Drawer** — 浮层白色表面、`8px` 圆角、`box-shadow` 阴影
- **Tag** — `4px` 圆角,基于语义色阶的浅色填充
- **Table** — `#fafafa` 表头背景,行悬停 `rgba(0, 0, 0, 0.04)`,分割线 `#f0f0f0`

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
