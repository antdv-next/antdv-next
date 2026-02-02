---
category: Components
group: 反馈
title: Popconfirm
subtitle: 气泡确认框
description: 点击元素，弹出气泡式的确认框。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a7tqQ6wrdeAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iwYsQpeFcB0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 `confirm` 弹出的全屏居中模态对话框相比，交互形式更轻量。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/locale.vue">国际化</demo>
  <demo src="./demo/placement.vue">位置</demo>
  <demo src="./demo/shift.vue" iframe="300">贴边偏移</demo>
  <demo src="./demo/dynamic-trigger.vue">条件触发</demo>
  <demo src="./demo/icon.vue">自定义 Icon 图标</demo>
  <demo src="./demo/async.vue">异步关闭</demo>
  <demo src="./demo/promise.vue">基于 Promise 的异步关闭</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| cancelButtonProps | cancel 按钮 props | ButtonProps | - | - |
| cancelText | 取消按钮文字 | VueNode | `取消` | - |
| disabled | 阻止点击 Popconfirm 子元素时弹出确认框 | boolean | false | - |
| icon | 自定义弹出气泡 Icon 图标 | VueNode | &lt;ExclamationCircleFilled /&gt; | - |
| okButtonProps | ok 按钮 props | ButtonProps | - | - |
| okText | 确认按钮文字 | VueNode | `确定` | - |
| okType | 确认按钮类型 | LegacyButtonType | `primary` | - |
| showCancel | 是否显示取消按钮 | boolean | true | - |
| title | 确认框标题 | VueNode | - | - |
| description | 确认内容的详细描述 | VueNode | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | PopconfirmClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | PopconfirmStylesType | - | - |

Popconfirm 还支持 Popover 的所有属性，详见 [Popover](/components/popover-cn#api)。

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| openChange | 显隐变化时回调 | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |
| confirm | 点击确认的回调 | (e?: MouseEvent) =&gt; void | - |
| cancel | 点击取消的回调 | (e?: MouseEvent) =&gt; void | - |
| popupClick | 弹出气泡点击事件 | (e: MouseEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 确认框标题 | () =&gt; any | - |
| description | 确认内容的详细描述 | () =&gt; any | - |
| icon | 自定义弹出气泡 Icon 图标 | () =&gt; any | - |
| okText | 确认按钮文字 | () =&gt; any | - |
| cancelText | 取消按钮文字 | () =&gt; any | - |


## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Popconfirm" />

参考 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

## FAQ

更多问题，请参考 [Tooltip FAQ](/components/tooltip-cn#faq)。
