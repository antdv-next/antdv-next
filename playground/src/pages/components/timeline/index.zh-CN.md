---
category: Components
group: 数据展示
title: Timeline
subtitle: 时间轴
description: 垂直展示的时间流信息。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FkTySqNt3sYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*yIl9S4hAIBcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 当有一系列信息需要按时间排列（升序或降序）时。
- 当需要用时间轴来进行视觉连接时。

## 代码演示 {#examples}

<demo-group>
<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/variant.vue">变体样式</demo>
<demo src="./demo/pending.vue">等待及排序</demo>
<demo src="./demo/alternate.vue">交替展现</demo>
<demo src="./demo/horizontal.vue">水平布局</demo>
<demo src="./demo/custom.vue">自定义时间轴点</demo>
<demo src="./demo/end.vue">另一侧时间轴点</demo>
<demo src="./demo/title.vue">标题</demo>
<demo src="./demo/title-span.vue">标题占比</demo>
<demo src="./demo/style-class.vue">自定义语义化自定义</demo>
<demo src="./demo/semantic.vue">语义化结构</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;SemanticDOM, string&gt; | - | - |
| items | 选项配置 | TimelineItemProps[] | - | - |
| mode | 通过设置 `mode` 可以改变时间轴和内容的相对位置 | `left` \| `alternate` \| `right` | - | - |
| pending | 指定最后一个幽灵节点是否存在或内容，请使用 `item.loading` 代替 | VueNode | false | - |
| pendingDot | 当最后一个幽灵节点存在時，指定其时间图点，请使用 `item.icon` 代替 | VueNode | &lt;LoadingOutlined /&gt; | - |
| reverse | 节点排序 | boolean | false | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;SemanticDOM, CSSProperties&gt; | - | - |
| dotRender | 自定义时间轴点渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| labelRender | 自定义时间轴标签渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| contentRender | 自定义时间轴内容渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| pending | 指定最后一个幽灵节点是否存在或内容 | () =&gt; VueNode | - |
| pendingDot | 当最后一个幽灵节点存在時，指定其时间图点 | () =&gt; VueNode | - |
| dotRender | 自定义时间轴点渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| labelRender | 自定义时间轴标签渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| contentRender | 自定义时间轴内容渲染函数 | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |

## 类型 {#types}

### TimelineItem

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 设置内容 | VueNode | - | - |
| color | 指定圆圈颜色 `blue`、`red`、`green`、`gray`，或自定义的色值 | string | `blue` | - |
| dot | 自定义时间轴点 | VueNode | - | - |
| key | 该项的唯一标识 | Key | - | - |
| label | 设置标签 | VueNode | - | - |
| loading | 设置加载状态 | boolean | false | - |
| pending | 是否为待定状态 | boolean | false | - |
| position | 自定义节点位置 | `left` \| `right` | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Timeline"></ComponentTokenTable>
