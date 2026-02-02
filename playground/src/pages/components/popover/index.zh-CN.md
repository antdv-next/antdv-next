---
category: Components
group: 数据展示
title: Popover
subtitle: 气泡卡片
description: 点击/鼠标移入元素，弹出气泡式的卡片浮层。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kfW5RrfF4L8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*6b8fSKVVtXIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 `Tooltip` 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/trigger-type.vue">三种触发方式</demo>
  <demo src="./demo/placement.vue">位置</demo>
  <demo src="./demo/arrow.vue">箭头展示</demo>
  <demo src="./demo/shift.vue" iframe="300">贴边偏移</demo>
  <demo src="./demo/control.vue">从浮层内关闭</demo>
  <demo src="./demo/hover-with-click.vue">悬停点击弹出窗口</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 卡片标题 | VueNode | - | - |
| content | 卡片内容 | VueNode | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | PopoverClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | PopoverStylesType | - | - |

Popover 还支持 Tooltip 的所有属性，详见 [Tooltip](/components/tooltip-cn#api)。

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| openChange | 显隐变化时回调 | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 卡片标题 | () =&gt; any | - |
| content | 卡片内容 | () =&gt; any | - |

## 注意 {#note}

请确保 `Popover` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Popover" />

参考 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

## FAQ

更多问题，请参考 [Tooltip FAQ](/components/tooltip-cn#faq)。
