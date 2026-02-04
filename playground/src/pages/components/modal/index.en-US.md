---
group: Feedback
category: Components
title: Modal
description: Display a modal dialog box, providing a title, content area, and action buttons.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Z9vzQZAdJDQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WtgsSLPa1Z4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

When requiring users to interact with the application, but without jumping to a new page and interrupting the user's workflow, you can use `Modal` to create a new floating layer over the current page to get user feedback or display information.

Additionally, if you need to show a simple confirmation dialog, you can use [`App.useApp`](/components/app/) hooks.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/async.vue">Asynchronously close</demo>
  <demo src="./demo/footer.vue">Customized Footer</demo>
  <demo src="./demo/mask.vue">mask</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/footer-render.vue">Customized Footer render function</demo>
  <demo src="./demo/hooks.vue">Use hooks to get context</demo>
  <demo src="./demo/locale.vue">Internationalization</demo>
  <demo src="./demo/manual.vue">Manual to update destroy</demo>
  <demo src="./demo/position.vue">To customize the position of modal</demo>
  <demo src="./demo/button-props.vue">Customize footer buttons props</demo>
  <demo src="./demo/modal-render.vue">Custom modal content render</demo>
  <demo src="./demo/width.vue">To customize the width of modal</demo>
  <demo src="./demo/static-info.vue">Static Method</demo>
  <demo src="./demo/confirm.vue">Static confirmation</demo>
  <demo src="./demo/confirm-router.vue">destroy confirmation modal dialog</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| afterOpenChange | Callback when the animation ends when Modal is turned on and off | (open: boolean) => void | - | - |
| cancelButtonProps | The cancel button props | ButtonProps | - | - |
| cancelText | Text of the Cancel button | VueNode | `Cancel` | - |
| centered | Centered Modal | boolean | false | - |
| classes | Customize class for each semantic structure inside the Modal component. Supports object or function. | ModalClassNamesType | - | - |
| closable | Whether a close (x) button is visible on top right or not | boolean \| [ClosableType](#closabletype) | true | - |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VueNode | &lt;CloseOutlined /> | - |
| confirmLoading | Whether to apply loading visual effect for OK button or not | boolean | false | - |
| destroyOnHidden | Whether to unmount child components on close | boolean | false | - |
| focusTriggerAfterClose | Whether need to focus trigger element after dialog is closed | boolean | true | - |
| footer | Footer content, set as `footer={null}` when you don't need default buttons | VueNode \| (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | (OK and Cancel buttons) | - |
| forceRender | Force render Modal | boolean | false | - |
| getContainer | The mounted node for Modal but still display at fullscreen | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| loading | Show the skeleton | boolean | false | - |
| mask | Mask effect | MaskType | true | - |
| maskClosable | Whether to close the modal dialog when the mask (area outside the modal) is clicked | boolean | true | - |
| modalRender | Custom modal content render | (node: any) => any | - | - |
| mousePosition | Set animation start position | MousePosition | - | - |
| okButtonProps | The ok button props | ButtonProps | - | - |
| okText | Text of the OK button | VueNode | `OK` | - |
| okType | Button `type` of the OK button | LegacyButtonType | `primary` | - |
| open | Whether the modal dialog is visible or not, support `v-model:open` | boolean | false | - |
| rootClass | Root container class | string | - | - |
| rootStyle | Root container style | CSSProperties | - | - |
| styles | Customize inline style for each semantic structure inside the Modal component. Supports object or function. | ModalStylesType | - | - |
| title | The modal dialog's title | VueNode | - | - |
| transitionName | Transition name of dialog | string | - | - |
| maskTransitionName | Transition name of mask | string | - | - |
| width | Width of the modal dialog | string \| number \| Partial<Record<Breakpoint, string \| number>> | 520 | - |
| wrapClassName | The class name of the container of the modal dialog | string | - | - |
| wrapProps | Wrapper element props | Record<string, any> | - | - |
| zIndex | The `z-index` of the Modal | number | 1000 | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| ok | Callback when the OK button is clicked | (e: MouseEvent) => void | - |
| cancel | Callback when the mask, close button or Cancel button is clicked | (e: MouseEvent) => void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Modal content | () => any | - |
| title | Title | () => any | - |
| footer | Footer content | (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | - |
| okText | OK button text | () => any | - |
| cancelText | Cancel button text | () => any | - |
| closeIcon | Custom close icon | () => any | - |
| modalRender | Custom modal content render | (node: any) => any | - |

### Note

- The state of Modal will be preserved at its component lifecycle by default, if you wish to open it with a brand new state every time, set `destroyOnHidden` on it.
- If you use Form in Modal, and need to clear fields when closing, set `<a-form :preserve="false" />`.
- `Modal.method()` RTL mode only supports hooks usage.

### Modal.method() {#modalmethod}

There are five ways to display the information based on the content's nature:

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

The items listed above are all functions, expecting a settings object as parameter. The properties of the object are follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| autoFocusButton | Specify which button to autofocus | null \| `ok` \| `cancel` | `ok` | - |
| cancelButtonProps | The cancel button props | ButtonProps | - | - |
| cancelText | Text of the Cancel button with Modal.confirm | string | `Cancel` | - |
| centered | Centered Modal | boolean | false | - |
| class | Container class | string | - | - |
| rootClass | Root container class | string | - | - |
| closable | Whether a close (x) button is visible on top right of the confirm dialog or not | boolean \| [ClosableType](#closabletype) | false | - |
| closeIcon | Custom close icon | VueNode | - | - |
| content | Content | VueNode | - | - |
| footer | Footer content, set as `footer: null` when you don't need default buttons | VueNode \| (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | - | - |
| getContainer | Return the mount node for Modal | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| icon | Custom icon | VueNode | &lt;ExclamationCircleFilled /> | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| mask | Mask effect | MaskType | true | - |
| maskClosable | Whether to close the modal dialog when the mask is clicked | boolean | false | - |
| okButtonProps | The ok button props | ButtonProps | - | - |
| okText | Text of the OK button | string | `OK` | - |
| okType | Button `type` of the OK button | LegacyButtonType | `primary` | - |
| style | Style of floating layer, typically used at least for adjusting the position | CSSProperties | - | - |
| title | Title | VueNode | - | - |
| type | Dialog type | `info` \| `success` \| `error` \| `warn` \| `warning` \| `confirm` | `confirm` | - |
| width | Width of the modal dialog | string \| number | 416 | - |
| wrapClassName | The class name of the container of the modal dialog | string | - | - |
| zIndex | The `z-index` of the Modal | number | 1000 | - |
| onCancel | Click to onCancel callback, the parameter is the closing function | (close?: () => void) => void | - | - |
| onOk | Click to onOk callback, the parameter is the closing function | (close?: () => void) => void | - | - |

All the `Modal.method`s will return a reference, and then we can update and close the modal dialog by the reference.

### ClosableType {#closabletype}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| closeIcon | Custom close icon | VueNode | undefined | - |
| disabled | Whether disabled close icon | boolean | false | - |
| onClose | Trigger when modal close | () => void | undefined | - |

```ts
const modal = Modal.info()

modal.update({
  title: 'Updated title',
  content: 'Updated content',
})

modal.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title} (New)`,
}))

modal.destroy()
```

- `Modal.destroyAll`

`Modal.destroyAll()` could destroy all confirmation modal dialogs. Usually, you can use it in router change event to destroy confirm modal dialog automatically.

### Modal.useModal() {#modal-use-modal}

When you need using Context, you can use `contextHolder` which created by `Modal.useModal` to insert into children. Modal created by hooks will get all the context where `contextHolder` are. Created `modal` has the same creating function with `Modal.method`.

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

`modal.confirm` return method:

- `destroy`: Destroy current modal
- `update`: Update current modal
- `then`: (Hooks only) Promise chain call, support `await` operation

```ts
const confirmed = await modal.confirm({ ... })
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Modal"></ComponentTokenTable>

## FAQ

### Why content not update when Modal closed? {#faq-content-not-update}

Modal will use memo to avoid content jumping when closed. Also, if you use Form in Modal, you can reset `initialValues` by calling `resetFields` in effect.

### Why I can not access context in Modal.xxx? {#faq-context}

Modal static methods create an instance without context connection. When you need context info (like ConfigProvider context), you can use `Modal.useModal` to get `modal` instance and `contextHolder` node.
