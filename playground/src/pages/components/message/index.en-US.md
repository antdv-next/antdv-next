---
category: Components
group: Feedback
noinstant: true
title: Message
description: Display global messages as feedback in response to user operations.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Xl5ORK7Iy44AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fv7mQIWdUgcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- To provide feedback such as success, warning, error etc.
- A message is displayed at top and center and will be dismissed automatically, as a non-interrupting light-weighted prompt.

## Examples {#examples}

<demo-group>
  <demo src="./demo/hooks.vue">Hooks usage (recommended)</demo>
  <demo src="./demo/other.vue">Other types of message</demo>
  <demo src="./demo/duration.vue">Customize duration</demo>
  <demo src="./demo/loading.vue">Message with loading indicator</demo>
  <demo src="./demo/thenable.vue">Promise interface</demo>
  <demo src="./demo/custom-style.vue">Customized style</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/update.vue">Update Message Content</demo>
  <demo src="./demo/info.vue">Static method (deprecated)</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Static Methods {#static-methods}

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`
- `message.open(config)`
- `message.destroy(key?: Key)`
- `message.config(options)`
- `message.useMessage(config)`

### Arguments {#arguments}

| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| content | The content of the message | VueNode \| ArgsProps | - |
| duration | Time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 |
| onClose | Specify a function that will be called when the message is closed | () =&gt; void | - |

`afterClose` can be called in thenable interface:

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

where `level` refers one static methods of `message`. The result of `then` method will be a Promise.

### Config {#config}

The properties of `config` are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| class | Customized CSS class | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ArgsClassNamesType | - | - |
| content | The content of the message | VueNode | - | - |
| duration | Time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 | - |
| icon | Customized Icon | VueNode | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| key | The unique identifier of the Message | Key | - | - |
| style | Customized inline style | CSSProperties | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ArgsStylesType | - | - |
| type | Notice type | NoticeType | - | - |
| onClick | Specify a function that will be called when the message is clicked | (e: MouseEvent) =&gt; void | - | - |
| onClose | Specify a function that will be called when the message is closed | () =&gt; void | - | - |

### Global configuration {#global-config}

`message.config(options)`

```js
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
})
```

| Argument | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time before auto-dismiss, in seconds | number | 3 | - |
| getContainer | Return the mount node for Message, but still display at fullScreen | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| maxCount | Max message show, drop oldest if exceed limit | number | - | - |
| prefixCls | The prefix class name of message node | string | `ant-message` | - |
| rtl | Whether to enable RTL mode | boolean | false | - |
| top | Distance from top | string \| number | 8 | - |
| transitionName | Animation name | string | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ArgsClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ArgsStylesType | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Message"></ComponentTokenTable>

## FAQ

### Why I can not access context, ConfigProvider `locale/prefixCls/theme` in message? {#faq-context-redux}

Calling `message` methods will render a new instance which does not inherit the current context. When you need context info, use `message.useMessage` to get `api` and `ContextHolder`, then render it inside your component tree:

```vue
<script setup>
import { message } from 'antdv-next'

const [api, ContextHolder] = message.useMessage()
</script>

<template>
  <ContextHolder />
</template>
```

**Note:** You must insert `ContextHolder` into your children with hooks. You can use static methods if you do not need context connection.

> [App Package Component](/components/app) can be used to simplify `useMessage` and other methods that need to manually implant ContextHolder.

### How to set static methods prefixCls? {#faq-set-prefix-cls}

You can config with [`ConfigProvider.config`](/components/config-provider#configproviderconfig-4130).
