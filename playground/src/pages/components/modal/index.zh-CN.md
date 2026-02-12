---
group: 反馈
category: Components
title: Modal
subtitle: 对话框
description: 展示一个对话框，提供标题、内容区、操作区。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Z9vzQZAdJDQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WtgsSLPa1Z4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。

另外当需要一个简洁的确认框询问用户时，可以使用 [`App.useApp`](/components/app-cn/) 封装的语法糖方法。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/async.vue">异步关闭</demo>
  <demo src="./demo/footer.vue">自定义页脚</demo>
  <demo src="./demo/mask.vue">遮罩</demo>
  <demo src="./demo/loading.vue">加载中</demo>
  <demo src="./demo/footer-render.vue">自定义页脚渲染函数</demo>
  <demo src="./demo/hooks.vue">使用 hooks 获得上下文</demo>
  <demo src="./demo/locale.vue">国际化</demo>
  <demo src="./demo/manual.vue">手动更新和移除</demo>
  <demo src="./demo/position.vue">自定义位置</demo>
  <demo src="./demo/button-props.vue">自定义页脚按钮属性</demo>
  <demo src="./demo/modal-render.vue">自定义渲染对话框</demo>
  <demo src="./demo/width.vue">自定义模态的宽度</demo>
  <demo src="./demo/static-info.vue">静态方法</demo>
  <demo src="./demo/confirm.vue">静态确认对话框</demo>
  <demo src="./demo/confirm-router.vue">销毁确认对话框</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | () => void | - | - |
| afterOpenChange | 打开和关闭 Modal 时动画结束后的回调 | (open: boolean) => void | - | - |
| cancelButtonProps | cancel 按钮 props | ButtonProps | - | - |
| cancelText | 取消按钮文字 | VueNode | `取消` | - |
| centered | 垂直居中展示 Modal | boolean | false | - |
| classes | 用于自定义 Modal 组件内部各语义化结构的 class，支持对象或函数 | ModalClassNamesType | - | - |
| closable | 是否显示右上角的关闭按钮 | boolean \| [ClosableType](#closabletype) | true | - |
| closeIcon | 自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮 | VueNode | &lt;CloseOutlined /> | - |
| confirmLoading | 确定按钮 loading | boolean | false | - |
| destroyOnHidden | 关闭时销毁 Modal 里的子元素 | boolean | false | - |
| focusTriggerAfterClose | 对话框关闭后是否需要聚焦触发元素 | boolean | true | - |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `footer={null}` | VueNode \| (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | (确定取消按钮) | - |
| forceRender | 强制渲染 Modal | boolean | false | - |
| getContainer | 指定 Modal 挂载的节点，但依旧为全屏展示，`false` 为挂载在当前位置 | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true | - |
| loading | 显示骨架屏 | boolean | false | - |
| mask | 遮罩效果 | MaskType | true | - |
| maskClosable | 点击蒙层是否允许关闭 | boolean | true | - |
| modalRender | 自定义渲染对话框 | (node: any) => any | - | - |
| mousePosition | 设置动画起点位置 | MousePosition | - | - |
| okButtonProps | ok 按钮 props | ButtonProps | - | - |
| okText | 确认按钮文字 | VueNode | `确定` | - |
| okType | 确认按钮类型 | LegacyButtonType | `primary` | - |
| open | 对话框是否可见，支持 `v-model:open` | boolean | false | - |
| rootClass | 根容器 class | string | - | - |
| rootStyle | 根容器样式 | CSSProperties | - | - |
| styles | 用于自定义 Modal 组件内部各语义化结构的行内 style，支持对象或函数 | ModalStylesType | - | - |
| title | 标题 | VueNode | - | - |
| transitionName | 对话框过渡动效名称 | string | - | - |
| maskTransitionName | 遮罩过渡动效名称 | string | - | - |
| width | 宽度 | string \| number \| Partial<Record<Breakpoint, string \| number>> | 520 | - |
| wrapClassName | 对话框外层容器的类名 | string | - | - |
| wrapProps | 对话框外层容器属性 | Record<string, any> | - | - |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| ok | 点击确定回调 | (e: MouseEvent) => void | - |
| cancel | 点击遮罩层或右上角叉或取消按钮的回调 | (e: MouseEvent) => void | - |
| update:open | 对话框显隐变化 | (open: boolean) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 内容 | () => any | - |
| title | 标题 | () => any | - |
| footer | 底部内容 | (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | - |
| okText | 确认按钮文字 | () => any | - |
| cancelText | 取消按钮文字 | () => any | - |
| closeIcon | 自定义关闭图标 | () => any | - |
| modalRender | 自定义渲染内容 | (node: any) => any | - |

### 注意

- `<a-modal />` 默认关闭后状态不会自动清空，如果希望每次打开都是新内容，请设置 `destroyOnHidden`。
- `<a-modal />` 和 Form 一起配合使用时，设置 `destroyOnHidden` 也不会在 Modal 关闭时销毁表单字段数据，需要设置 `<a-form :preserve="false" />`。
- `Modal.method()` RTL 模式仅支持 hooks 用法。

### Modal.method() {#modalmethod}

包括：

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

以上均为一个函数，参数为 object，具体属性如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | () => void | - | - |
| autoFocusButton | 指定自动获得焦点的按钮 | null \| `ok` \| `cancel` | `ok` | - |
| cancelButtonProps | cancel 按钮 props | ButtonProps | - | - |
| cancelText | 设置 Modal.confirm 取消按钮文字 | string | `取消` | - |
| centered | 垂直居中展示 Modal | boolean | false | - |
| class | 容器类名 | string | - | - |
| rootClass | 根容器 class | string | - | - |
| closable | 是否显示右上角的关闭按钮 | boolean \| [ClosableType](#closabletype) | false | - |
| closeIcon | 自定义关闭图标 | VueNode | - | - |
| content | 内容 | VueNode | - | - |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `footer: null` | VueNode \| (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | - | - |
| getContainer | 指定 Modal 挂载的 HTML 节点，false 为挂载在当前 dom | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| icon | 自定义图标 | VueNode | &lt;ExclamationCircleFilled /> | - |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true | - |
| mask | 遮罩效果 | boolean \| `{enabled?: boolean, blur?: boolean, closable?: boolean, closable?: true}` | true |  |
| ~~maskClosable~~ | 点击蒙层是否允许关闭 | boolean | false |  |
| okButtonProps | ok 按钮 props | ButtonProps | - | - |
| okText | 确认按钮文字 | string | `确定` | - |
| okType | 确认按钮类型 | LegacyButtonType | `primary` | - |
| style | 可用于设置浮层的样式，调整浮层位置等 | CSSProperties | - | - |
| title | 标题 | VueNode | - | - |
| type | 对话框类型 | `info` \| `success` \| `error` \| `warn` \| `warning` \| `confirm` | `confirm` | - |
| width | 宽度 | string \| number | 416 | - |
| wrapClassName | 对话框外层容器的类名 | string | - | - |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 | - |
| onCancel | 点击取消回调，参数为关闭函数 | (close?: () => void) => void | - | - |
| onOk | 点击确定回调，参数为关闭函数 | (close?: () => void) => void | - | - |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

### ClosableType {#closabletype}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | () => void | - | - |
| closeIcon | 自定义关闭图标 | VueNode | undefined | - |
| disabled | 关闭图标是否禁用 | boolean | false | - |
| onClose | 弹窗关闭即时调用 | () => void | undefined | - |

```ts
const modal = Modal.info()

modal.update({
  title: '修改的标题',
  content: '修改的内容',
})

modal.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title}（新）`,
}))

modal.destroy()
```

- `Modal.destroyAll`

使用 `Modal.destroyAll()` 可以销毁弹出的确认窗（即上述的 `Modal.info`、`Modal.success`、`Modal.error`、`Modal.warning`、`Modal.confirm`）。

### Modal.useModal() {#modal-use-modal}

当你需要使用 Context 时，可以通过 `Modal.useModal` 创建一个 `contextHolder` 插入子节点中。通过 hooks 创建的临时 Modal 将会得到 `contextHolder` 所在位置的所有上下文。创建的 `modal` 对象拥有与 `Modal.method` 相同的创建通知方法。

```vue
<script setup lang="ts">
import { Modal } from 'antdv-next'
import { onMounted } from 'vue'

const [modal, ContextHolder] = Modal.useModal()

onMounted(() => {
  modal.confirm({
    title: 'Confirm',
    content: 'content',
  })
})
</script>

<template>
  <ContextHolder />
</template>
```

`modal.confirm` 返回方法：

- `destroy`：销毁当前窗口
- `update`：更新当前窗口
- `then`：Promise 链式调用，支持 `await` 操作（Hooks only）

```ts
const confirmed = await modal.confirm({ ...options })
```

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Modal"></ComponentTokenTable>

## FAQ

### 为什么关闭后内容不更新？ {#faq-content-not-update}

Modal 在关闭时会通过 memo 防止内容跳动，如果内容更新后没有生效，可以在 effect 中调用 `resetFields` 或者调整内容来源。

### 为什么 Modal.xxx 不能读取 Context？ {#faq-context}

静态方法创建的实例没有上下文连接。当你需要使用 ConfigProvider 等上下文信息时，请使用 `Modal.useModal`。借助 `contextHolder` 可保证上下文正确传递。
