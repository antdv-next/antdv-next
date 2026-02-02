---
category: Components
group: 反馈
noinstant: true
title: Notification
subtitle: 通知提醒框
description: 全局展示通知提醒信息。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cRmqTY4nKPEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*W3RmSov-xVMAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

在系统四个角显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/hooks.vue">Hooks 用法（推荐）</demo>
  <demo src="./demo/duration.vue">自动关闭延时</demo>
  <demo src="./demo/with-icon.vue">带图标的通知</demo>
  <demo src="./demo/with-btn.vue">自定义操作按钮</demo>
  <demo src="./demo/custom-icon.vue">自定义图标</demo>
  <demo src="./demo/placement.vue">位置</demo>
  <demo src="./demo/custom-style.vue">自定义样式</demo>
  <demo src="./demo/update.vue">更新通知内容</demo>
  <demo src="./demo/stack.vue">堆叠</demo>
  <demo src="./demo/show-with-progress.vue">显示进度条</demo>
  <demo src="./demo/basic.vue">静态方法（不推荐）</demo>
  <demo src="./demo/progress-color.vue">自定义进度条颜色</demo>
  <demo src="./demo/style-class.vue">自定义语义化结构样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 静态方法 {#static-methods}

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.open(config)`
- `notification.destroy(key?: Key)`
- `notification.config(options)`
- `notification.useNotification(config)`

### ArgsProps {#args-props}

`config` 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 通知提醒标题 | VueNode | - | - |
| description | 通知提醒内容 | VueNode | - | - |
| actions | 自定义按钮组 | VueNode | - | - |
| key | 当前通知唯一标志 | Key | - | - |
| duration | 默认 4.5 秒后自动关闭，配置为 `0 \| false` 则不会自动关闭 | number \| false | 4.5 | - |
| showProgress | 显示自动关闭通知框的进度条 | boolean | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true | - |
| icon | 自定义图标 | VueNode | - | - |
| placement | 弹出位置，可选 `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| class | 自定义 CSS class | string | - | - |
| style | 自定义内联样式 | CSSProperties | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | NotificationClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | NotificationStylesType | - | - |
| type | 通知类型 | IconType | - | - |
| onClick | 点击通知时触发的回调函数 | () =&gt; void | - | - |
| onClose | 当通知关闭时触发 | () =&gt; void | - | - |
| closeIcon | 自定义关闭图标，设置为 null 或 false 时隐藏关闭按钮 | VueNode | true | - |
| closable | 是否显示右上角的关闭按钮 | boolean \| ClosableType | true | - |
| props | 透传至通知 `div` 的 props，支持 `data-testid`、`aria-*` 或 `role` | DivProps | - | - |
| role | 供屏幕阅读器识别的通知内容语义 | 'alert' \| 'status' | `alert` | - |

### notification.useNotification {#use-notification}

`config` 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | number | 24 | - |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | number | 24 | - |
| placement | 弹出位置，可选 `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| getContainer | 配置渲染节点的输出位置 | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| duration | 默认 4.5 秒后自动关闭，配置为 `0 \| false` 则不会自动关闭 | number \| false | 4.5 | - |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - | - |
| rtl | 是否开启 RTL 模式 | boolean | false | - |
| stack | 堆叠模式，超过阈值时会将所有消息收起 | boolean \| &#123; threshold?: number &#125; | &#123; threshold: 3 &#125; | - |
| showProgress | 显示自动关闭通知框的进度条 | boolean | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true | - |
| closeIcon | 自定义关闭图标，设置为 null 或 false 时隐藏关闭按钮 | VueNode | true | - |
| prefixCls | - | string | `ant-notification` | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | NotificationClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | NotificationStylesType | - | - |

### ClosableType {#closabletype}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| closeIcon | 自定义关闭图标 | VueNode | - | - |
| onClose | 当通知关闭时触发 | () =&gt; void | - | - |
| disabled | 是否禁用关闭按钮 | boolean | - | - |

### 全局配置 {#global-config}

`notification.config(options)`

```js
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
  rtl: true,
})
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | number | 24 | - |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | number | 24 | - |
| duration | 默认 4.5 秒后自动关闭，配置为 `0 \| false` 则不会自动关闭 | number \| false | 4.5 | - |
| showProgress | 显示自动关闭通知框的进度条 | boolean | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true | - |
| prefixCls | - | string | `ant-notification` | - |
| getContainer | 配置渲染节点的输出位置 | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| placement | 弹出位置，可选 `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| closeIcon | 自定义关闭图标，设置为 null 或 false 时隐藏关闭按钮 | VueNode | true | - |
| closable | 是否显示右上角的关闭按钮 | ClosableType | - | - |
| rtl | 是否开启 RTL 模式 | boolean | false | - |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - | - |
| props | 透传至通知 `div` 的 props，支持 `data-testid`、`aria-*` 或 `role` | DivProps | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Notification"></ComponentTokenTable>

## FAQ

### 为什么 notification 不能获取 ConfigProvider 的 `locale/prefixCls/theme` 等配置？ {#faq-context-redux}

直接调用 notification 方法会创建新的实例，无法继承当前上下文。需要上下文信息时，请使用 `notification.useNotification` 获取 `api` 和 `ContextHolder` 并渲染到组件树中：

```vue
<script setup>
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()
</script>

<template>
  <ContextHolder />
</template>
```

**注意：** 通过 hooks 创建的 `ContextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用静态方法。

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useNotification` 等方法需要手动植入 ContextHolder 的问题。

### 静态方法如何设置 prefixCls？ {#faq-set-prefix-cls}

你可以通过 [`ConfigProvider.config`](/components/config-provider-cn#configproviderconfig-4130) 进行设置。
