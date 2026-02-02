---
category: Components
group: 反馈
noinstant: true
title: Message
subtitle: 全局提示
description: 全局展示操作反馈信息。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Xl5ORK7Iy44AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fv7mQIWdUgcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/hooks.vue">Hooks 用法（推荐）</demo>
  <demo src="./demo/other.vue">其他类型</demo>
  <demo src="./demo/duration.vue">自定义时长</demo>
  <demo src="./demo/loading.vue">加载中</demo>
  <demo src="./demo/thenable.vue">Promise 接口</demo>
  <demo src="./demo/custom-style.vue">自定义样式</demo>
  <demo src="./demo/style-class.vue">自定义语义化结构样式</demo>
  <demo src="./demo/update.vue">更新消息内容</demo>
  <demo src="./demo/info.vue">静态方法（不推荐）</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 静态方法 {#static-methods}

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`
- `message.open(config)`
- `message.destroy(key?: Key)`
- `message.config(options)`
- `message.useMessage(config)`

### 参数 {#arguments}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | VueNode \| ArgsProps | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | number | 3 |
| onClose | 关闭时触发的回调函数 | () =&gt; void | - |

组件同时提供 Promise 接口：

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

其中 `message[level]` 是组件已经提供的静态方法。`then` 接口返回值是 Promise。

### Config {#config}

`config` 对象属性如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| class | 自定义 CSS class | string | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | ArgsClassNamesType | - | - |
| content | 提示内容 | VueNode | - | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | number | 3 | - |
| icon | 自定义图标 | VueNode | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true | - |
| key | 当前提示的唯一标志 | Key | - | - |
| style | 自定义内联样式 | CSSProperties | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | ArgsStylesType | - | - |
| type | 通知类型 | NoticeType | - | - |
| onClick | 点击 message 时触发的回调函数 | (e: MouseEvent) =&gt; void | - | - |
| onClose | 关闭时触发的回调函数 | () =&gt; void | - | - |

### 全局配置 {#global-config}

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

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| duration | 默认自动关闭延时，单位秒 | number | 3 | - |
| getContainer | 配置渲染节点的输出位置，但依旧为全屏展示 | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - | - |
| prefixCls | 消息节点的 class 前缀 | string | `ant-message` | - |
| rtl | 是否开启 RTL 模式 | boolean | false | - |
| top | 消息距离顶部的位置 | string \| number | 8 | - |
| transitionName | 动画名称 | string | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | ArgsClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | ArgsStylesType | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Message"></ComponentTokenTable>

## FAQ

### 为什么 message 不能获取 ConfigProvider 的 `locale/prefixCls/theme` 等配置？ {#faq-context-redux}

直接调用 message 方法会创建新的实例，无法继承当前上下文。需要上下文信息时，请使用 `message.useMessage` 获取 `api` 和 `ContextHolder` 并渲染到组件树中：

```vue
<script setup>
import { message } from 'antdv-next'

const [api, ContextHolder] = message.useMessage()
</script>

<template>
  <ContextHolder />
</template>
```

**注意：** 通过 hooks 创建的 `ContextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用静态方法。

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useMessage` 等方法需要手动植入 ContextHolder 的问题。

### 静态方法如何设置 prefixCls？ {#faq-set-prefix-cls}

你可以通过 [`ConfigProvider.config`](/components/config-provider-cn#configproviderconfig-4130) 进行设置。
