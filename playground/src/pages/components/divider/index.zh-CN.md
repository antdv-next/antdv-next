---
category: Components
title: Divider
subtitle: 分割线
description: 区隔内容的分割线。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7sMiTbzvaDoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KPSEQ74PLg4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/horizontal.vue">水平分割线</demo>
  <demo src="./demo/with-text.vue">带文字的分割线</demo>
  <demo src="./demo/vertical.vue">垂直分割线</demo>
  <demo src="./demo/plain.vue">分割文字使用正文样式</demo>
  <demo src="./demo/variant.vue">变体</demo>
  <demo src="./demo/size.vue">设置分割线的间距大小</demo>
  <demo src="./demo/customize-style.vue">样式自定义</demo>
  <demo src="./demo/style-calss.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dashed | 是否虚线 | boolean | false |
| orientation | 水平或垂直类型 | `horizontal` \| `vertical` | `horizontal` |
| plain | 文字是否显示为普通正文样式 | boolean | false |
| size | 间距大小，仅对水平布局有效 | `small` \| `middle` \| `large` | - |
| titlePlacement | 分割线标题的位置 | `start` \| `end` \| `center` | `center` |
| variant | 分割线是虚线、点线还是实线 | `dashed` \| `dotted` \| `solid` | `solid` |
| vertical | 是否垂直，和 orientation 同时配置以 orientation 优先 | boolean | false |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - |

## 语义化 DOM 结构 {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Divider" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
