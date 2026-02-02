---
category: Components
group: Feedback
noinstant: true
title: Notification
description: Prompt notification message globally.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cRmqTY4nKPEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*W3RmSov-xVMAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

To display a notification message at any of the four corners of the viewport. Typically it can be used in the following cases:

- A notification with complex content.
- A notification providing a feedback based on the user interaction. Or it may show some details about upcoming steps the user may have to follow.
- A notification that is pushed by the application.

## Examples {#examples}

<demo-group>
  <demo src="./demo/hooks.vue">Hooks usage (recommended)</demo>
  <demo src="./demo/duration.vue">Duration after which the notification box is closed</demo>
  <demo src="./demo/with-icon.vue">Notification with icon</demo>
  <demo src="./demo/with-btn.vue">Custom close button</demo>
  <demo src="./demo/custom-icon.vue">Customized icon</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/custom-style.vue">Customized style</demo>
  <demo src="./demo/update.vue">Update message content</demo>
  <demo src="./demo/stack.vue">Stack</demo>
  <demo src="./demo/show-with-progress.vue">Show with progress</demo>
  <demo src="./demo/basic.vue">Static method (deprecated)</demo>
  <demo src="./demo/progress-color.vue">Customize progress bar color</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Static Methods {#static-methods}

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.open(config)`
- `notification.destroy(key?: Key)`
- `notification.config(options)`
- `notification.useNotification(config)`

### ArgsProps {#args-props}

The properties of `config` are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | The title of notification box | VueNode | - | - |
| description | The content of notification box | VueNode | - | - |
| actions | Customized button group | VueNode | - | - |
| key | The unique identifier of the Notification | Key | - | - |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| icon | Customized icon | VueNode | - | - |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| class | Customized CSS class | string | - | - |
| style | Customized inline style | CSSProperties | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | NotificationClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | NotificationStylesType | - | - |
| type | Notification type | IconType | - | - |
| onClick | Specify a function that will be called when the notification is clicked | () =&gt; void | - | - |
| onClose | Trigger when notification closed | () =&gt; void | - | - |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - |
| closable | Whether to show close button | boolean \| ClosableType | true | - |
| props | Props passed to the notification `div`, supports `data-testid`, `aria-*`, or `role` | DivProps | - | - |
| role | The semantics of notification content recognized by screen readers | 'alert' \| 'status' | `alert` | - |

### notification.useNotification {#use-notification}

The properties of `config` are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| top | Distance from the top of the viewport, when `placement` is `top` `topRight` or `topLeft` (unit: pixels) | number | 24 | - |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom` `bottomRight` or `bottomLeft` (unit: pixels) | number | 24 | - |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| getContainer | Return the mount node for Notification | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | - |
| rtl | Whether to enable RTL mode | boolean | false | - |
| stack | Notifications will be stacked when amount is over threshold | boolean \| &#123; threshold?: number &#125; | &#123; threshold: 3 &#125; | - |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - |
| prefixCls | - | string | `ant-notification` | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | NotificationClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | NotificationStylesType | - | - |

### ClosableType {#closabletype}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closeIcon | Custom close icon | VueNode | - | - |
| onClose | Trigger when notification close | () =&gt; void | - | - |
| disabled | Whether the close button is disabled | boolean | - | - |

### Global configuration {#global-config}

`notification.config(options)`

```js
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
  rtl: true,
})
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| top | Distance from the top of the viewport, when `placement` is `top` `topRight` or `topLeft` (unit: pixels) | number | 24 | - |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom` `bottomRight` or `bottomLeft` (unit: pixels) | number | 24 | - |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| prefixCls | - | string | `ant-notification` | - |
| getContainer | Return the mount node for Notification | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - |
| closable | Whether to show close button | ClosableType | - | - |
| rtl | Whether to enable RTL mode | boolean | false | - |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | - |
| props | Props passed to the notification `div`, supports `data-testid`, `aria-*`, or `role` | DivProps | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Notification"></ComponentTokenTable>

## FAQ

### Why I can not access context, ConfigProvider `locale/prefixCls/theme` in notification? {#faq-context-redux}

Calling `notification` methods will render a new instance which does not inherit the current context. When you need context info, use `notification.useNotification` to get `api` and `ContextHolder`, then render it inside your component tree:

```vue
<script setup>
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()
</script>

<template>
  <ContextHolder />
</template>
```

**Note:** You must insert `ContextHolder` into your children with hooks. You can use static methods if you do not need context connection.

> [App Package Component](/components/app) can be used to simplify `useNotification` and other methods that need to manually implant ContextHolder.

### How to set static methods prefixCls? {#faq-set-prefix-cls}

You can config with [`ConfigProvider.config`](/components/config-provider#configproviderconfig-4130).
