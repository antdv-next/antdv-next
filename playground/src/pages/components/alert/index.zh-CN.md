---
category: Components
title: Alert
subtitle: 警告提示
description: 警告提示，展现需要关注的信息。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*QsvtS41m45UAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gOTISoMFZV0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 当需要向用户显示警告信息时。
- 当需要一个可由用户关闭的持久静态容器时。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/style.vue">更多类型</demo>
  <demo src="./demo/closable.vue">可关闭</demo>
  <demo src="./demo/description.vue">含辅助性文字</demo>
  <demo src="./demo/icon.vue">图标</demo>
  <demo src="./demo/banner.vue" iframe="250">顶部公告</demo>
  <demo src="./demo/loop-banner.vue">轮播公告</demo>
  <demo src="./demo/smooth-closed.vue">平滑卸载</demo>
  <demo src="./demo/custom-icon.vue" debug>自定义图标</demo>
  <demo src="./demo/action.vue">自定义操作</demo>
  <demo src="./demo/component-token.vue" debug>组件 Token</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 指定警告提示的样式，有四种选择 `success`、`info`、`warning`、`error` | 'success' \| 'info' \| 'warning' \| 'error' | `info`，`banner` 模式下默认值为 `warning` | - |
| closable | 可关闭配置，&gt;=5.15.0: 支持 `aria-*` | ClosableType | `false` | - |
| title | 警告提示内容 | VueNode | - | - |
| message | 警告提示内容，请使用 `title` 替换 | VueNode | - | - |
| description | 警告提示的辅助性文字介绍 | VueNode | - | - |
| afterClose | 关闭动画结束后触发的回调函数，请使用 `closable.afterClose` 替换 | () =&gt; void | - | - |
| showIcon | 是否显示辅助图标 | boolean | false，`banner` 模式下默认值为 true | - |
| role | https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute | string | - | - |
| classes | 自定义组件内部各语义化结构的类名。支持对象或函数 | AlertClassNamesType | - | - |
| styles | 自定义组件内部各语义化结构的内联样式。支持对象或函数 | AlertStylesType | - | - |
| banner | 是否用作顶部公告 | boolean | false | - |
| icon | 自定义图标，`showIcon` 为 true 时有效 | VueNode | - | - |
| closeIcon | - | VueNode | - | - |
| action | 自定义操作项 | VueNode | - | 4.9.0 |
| id | - | string | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| close | Callback when close Alert | (e: any) =&gt; any | - |
| mouseenter | - | (e: any) =&gt; any | - |
| mouseleave | - | (e: any) =&gt; any | - |
| click | - | (e: any) =&gt; any | - |

### 插槽 {#slots}

| 插槽          | 说明 | 类型 | 版本 |
|-------------| --- | --- | --- |
| message     | 警告提示内容，请使用 `title` 替换 | () =&gt; any | - |
| title       | 警告提示内容 | () =&gt; any | - |
| description | 警告提示的辅助性文字介绍 | () =&gt; any | - |
| icon        | 自定义图标，`showIcon` 为 true 时有效 | () =&gt; any | - |
| closeIcon   | - | () =&gt; any | - |
| action      | 自定义操作项 | () =&gt; any | 4.9.0 |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Alert"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
