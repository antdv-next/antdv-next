---
category: Components
group: 导航
title: Steps
subtitle: 步骤条
description: 引导用户按照流程完成任务的导航条。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*677sTqCpE3wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cFsBQLA0b7UAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/error.vue">步骤运行错误</demo>
  <demo src="./demo/vertical.vue">竖直方向的步骤条</demo>
  <demo src="./demo/clickable.vue">可点击</demo>
  <demo src="./demo/panel.vue">面板式步骤</demo>
  <demo src="./demo/icon.vue">带图标的步骤条</demo>
  <demo src="./demo/title-placement.vue">标签放置位置与进度</demo>
  <demo src="./demo/progress-dot.vue">点状步骤条</demo>
  <demo src="./demo/nav.vue">导航步骤</demo>
  <demo src="./demo/inline.vue">内联步骤</demo>
  <demo src="./demo/inline-variant.vue">内联样式组合</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

整体步骤条。

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | StepsClassNamesType | - | - |
| current | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态，支持 `v-model:current` | number | 0 | - |
| iconRender | 自定义渲染图标，请优先使用 `items.icon` | (oriNode, info: &#123; index, active, item &#125;) =&gt; VueNode | - | - |
| initial | 起始序号，从 0 开始记数 | number | 0 | - |
| items | 配置选项卡内容 | [StepItem](#stepitem)[] | [] | 4.24.0 |
| orientation | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向 | `horizontal` \| `vertical` | `horizontal` | - |
| percent | 当前 `process` 步骤显示的进度条进度（只对基本类型的 Steps 生效） | number | - | 4.5.0 |
| progressDot | 点状步骤条，可以设置为一个 function，`titlePlacement` 将强制为 `vertical` | boolean \| (iconDot, &#123; index, status, title, content &#125;) =&gt; VueNode | false | - |
| responsive | 当屏幕宽度小于 `532px` 时自动变为垂直模式 | boolean | true | - |
| size | 指定大小，目前支持普通（`default`）和迷你（`small`） | `default` \| `small` | `default` | - |
| status | 指定当前步骤的状态，可选 `wait` `process` `finish` `error` | `wait` \| `process` \| `finish` \| `error` | `process` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | StepsStylesType | - | - |
| titlePlacement | 指定标签放置位置，默认水平放图标右侧，可选 `vertical` 放图标下方 | `horizontal` \| `vertical` | `horizontal` | - |
| type | 步骤条类型，可选 `default` `dot` `inline` `navigation` `panel` | `default` \| `dot` \| `inline` \| `navigation` \| `panel` | `default` | - |
| variant | 设置样式变体 | `filled` \| `outlined` | `filled` | - |

### 事件 {events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 点击切换步骤时触发 | (current: number) =&gt; void | - |

### 插槽 {slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| iconRender | 自定义渲染图标，请优先使用 `items.icon` | (info: &#123; oriNode, index, active, item &#125;) =&gt; VueNode | - |
| progressDot | 自定义进度点 | (iconDot, &#123; index, status, title, content &#125;) =&gt; VueNode | - |

## 类型 {#types}

### StepItem

步骤条内的每一个步骤。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 步骤的详情描述，可选 | VueNode | - | - |
| disabled | 禁用点击 | boolean | false | - |
| icon | 步骤图标的类型，可选 | VueNode | - | - |
| status | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait` `process` `finish` `error` | `wait` \| `process` \| `finish` \| `error` | `wait` | - |
| subTitle | 子标题 | VueNode | - | - |
| title | 标题 | VueNode | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Steps"></ComponentTokenTable>
