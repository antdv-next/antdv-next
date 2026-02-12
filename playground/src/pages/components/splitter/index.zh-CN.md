---
category: Components
group: 布局
title: Splitter
subtitle: 分割面板
description: 分割面板用于隔离内容。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*f0SISaETY0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*y92yRYhObU8AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
tag: 5.21.0
---

## 何时使用

提供可拖动的分割面板，用于创建复杂的多列或多行布局。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/size.vue">基础用法</demo>
  <demo src="./demo/vertical.vue">垂直</demo>
  <demo src="./demo/control.vue">受控模式</demo>
  <demo src="./demo/collapsible.vue">可折叠</demo>
  <demo src="./demo/collapsibleIcon.vue">折叠图标</demo>
  <demo src="./demo/multiple.vue">多面板</demo>
  <demo src="./demo/group.vue">布局组合</demo>
  <demo src="./demo/size-mix.vue">尺寸混合</demo>
  <demo src="./demo/lazy.vue">延迟渲染</demo>
  <demo src="./demo/reset.vue" version="1.0.3">双击重置</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Splitter

#### 属性 {#splitter-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| collapsibleIcon | 自定义折叠图标 | &#123; start?: VueNode; end?: VueNode &#125; | - | 6.0.0 |
| draggerIcon | 自定义拖拽图标 | VueNode | - | 6.0.0 |
| lazy | 延迟渲染模式 | boolean | false | 5.23.0 |
| orientation | 布局方向 | `vertical` \| `horizontal` | `horizontal` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| vertical | 排列方向，与 `orientation` 同时存在，以 `orientation` 优先 | boolean | false | - |

#### 事件 {#splitter-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| collapse | 展开-收起时回调 | (collapsed: boolean[], sizes: number[]) =&gt; void | 5.28.0 |
| resize | 面板大小变化回调 | (sizes: number[]) =&gt; void | - |
| resizeEnd | 拖拽结束回调 | (sizes: number[]) =&gt; void | - |
| resizeStart | 开始拖拽之前回调 | (sizes: number[]) =&gt; void | - |

#### 插槽 {#splitter-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| collapsibleIconEnd | 自定义折叠结束图标 | () =&gt; VueNode | - |
| collapsibleIconStart | 自定义折叠开始图标 | () =&gt; VueNode | - |
| draggerIcon | 自定义拖拽图标 | () =&gt; VueNode | 6.0.0 |

### SplitterPanel

#### 属性 {#splitter-panel-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapsible | 启用折叠 | boolean \| &#123; start?: boolean; end?: boolean; showCollapsibleIcon?: boolean \| 'auto' &#125; | false | 5.28.0 |
| defaultSize | 面板初始大小，支持像素和百分比 | number \| string | - | - |
| max | 最大阈值，支持像素和百分比 | number \| string | - | - |
| min | 最小阈值，支持像素和百分比 | number \| string | - | - |
| resizable | 是否启用拉伸 | boolean | true | - |
| size | 受控面板大小，支持像素和百分比 | number \| string | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Splitter" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
