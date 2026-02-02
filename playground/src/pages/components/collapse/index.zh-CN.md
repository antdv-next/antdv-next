---
category: Components
group: 数据展示
title: Collapse
subtitle: 折叠面板
description: 可以折叠/展开的内容区域。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*B7HKR5OBe8gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sir-TK0HkWcAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- `手风琴` 是一种特殊的折叠面板，只允许单个内容区域展开。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">折叠面板</demo>
  <demo src="./demo/size.vue">面板尺寸</demo>
  <demo src="./demo/accordion.vue">手风琴</demo>
  <demo src="./demo/mix.vue">面板嵌套</demo>
  <demo src="./demo/borderless.vue">简洁风格</demo>
  <demo src="./demo/custom.vue">自定义面板</demo>
  <demo src="./demo/noarrow.vue">隐藏箭头</demo>
  <demo src="./demo/extra.vue">额外节点</demo>
  <demo src="./demo/ghost.vue">幽灵折叠面板</demo>
  <demo src="./demo/collapsible.vue">可折叠触发区域</demo>
  <demo src="./demo/style-class.vue">自定义语义结构样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)
### Collapse

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey | 当前激活 tab 面板的 key | Array&lt;string \| number&gt; \| string \| number | 手风琴模式下为第一个元素 | - |
| defaultActiveKey | 初始化选中面板的 key | Array&lt;string \| number&gt; \| string \| number | - | - |
| accordion | 手风琴模式 | boolean | false | - |
| destroyOnHidden | 销毁折叠隐藏的面板 | boolean | false | - |
| rootClass | 根节点 class | string | - | - |
| bordered | 带边框风格的折叠面板 | boolean | true | - |
| expandIcon | 自定义切换图标 | (panelProps: PanelProps) =&gt; any | - | - |
| expandIconPlacement | 设置图标位置 | ExpandIconPlacement | `start` | - |
| ghost | 使折叠面板透明且无边框 | boolean | false | - |
| size | 设置折叠面板大小 | SizeType | `middle` | - |
| collapsible | 所有子面板是否可折叠或指定可折叠触发区域 | CollapsibleType | - | - |
| labelRender | 自定义渲染label | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - |
| contentRender | 自定义渲染内容 | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | CollapseClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | CollapseStylesType | - | - |
| items | 折叠项目内容 | CollapseItemType[] | - | - |

#### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 切换面板的回调 | (key: string[]) =&gt; void | - |

#### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| expandIcon | 自定义切换图标 | (panelProps: PanelProps) =&gt; any | - |
| labelRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |
| contentRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |

### CollapsePanel {#collapsepanel}

#### 属性 {#collapsepanel-props}

:::warning 已废弃
请使用 items 方式配置面板。
:::

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | - | - |
| forceRender | 被隐藏时是否渲染 body 区域 DOM 结构 | boolean | false |  |
| key | 对应 activeKey | string \| number | - |  |
| showArrow | 是否展示当前面板上的箭头（为 false 时，collapsible 不能设为 icon） | boolean | true |  |

#### 插槽 {#collapsepanel-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| header | 面板标题 | VueNode | - |
| extra | 自定义渲染每个面板右上角的内容 | VueNode | - |

## 类型 {#types}

### ItemType {#itemtype}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 语义化结构 class | [`Record<header \| body, string>`](#semantic-dom) | - | - |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | - |  |
| extra | 自定义渲染每个面板右上角的内容 | VueNode | - |  |
| forceRender | 被隐藏时是否渲染 body 区域 DOM 结构 | boolean | false |  |
| key | 对应 activeKey | string \| number | - |  |
| label | 面板标题 | VueNode | - | - |
| showArrow | 是否展示当前面板上的箭头（为 false 时，collapsible 不能设为 icon） | boolean | true |  |
| styles | 语义化结构 style | [`Record<header \| body, CSSProperties>`](#semantic-dom) | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Collapse"></ComponentTokenTable>
