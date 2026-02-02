---
category: Components
group: Feedback
title: Popconfirm
description: Pop up a bubble confirmation box for an action.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a7tqQ6wrdeAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iwYsQpeFcB0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/locale.vue">Locale text</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/shift.vue" iframe="300">Auto Shift</demo>
  <demo src="./demo/dynamic-trigger.vue">Conditional trigger</demo>
  <demo src="./demo/icon.vue">Customize icon</demo>
  <demo src="./demo/async.vue">Asynchronously close</demo>
  <demo src="./demo/promise.vue">Asynchronously close on Promise</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | ButtonProps | - | - |
| cancelText | The text of the Cancel button | VueNode | `Cancel` | - |
| disabled | Whether to show popconfirm when clicking its children node | boolean | false | - |
| icon | Customize icon of confirmation | VueNode | &lt;ExclamationCircleFilled /&gt; | - |
| okButtonProps | The ok button props | ButtonProps | - | - |
| okText | The text of the Confirm button | VueNode | `OK` | - |
| okType | Button `type` of the Confirm button | LegacyButtonType | `primary` | - |
| showCancel | Show cancel button | boolean | true | - |
| title | The title of the confirmation box | VueNode | - | - |
| description | The description of the confirmation box | VueNode | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | PopconfirmClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | PopconfirmStylesType | - | - |

Popconfirm also supports all Popover props. See [Popover](/components/popover#api).

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when popconfirm visibility changes | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |
| confirm | Callback of confirmation | (e?: MouseEvent) =&gt; void | - |
| cancel | Callback of cancel | (e?: MouseEvent) =&gt; void | - |
| popupClick | Callback of popup click | (e: MouseEvent) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The title of the confirmation box | () =&gt; any | - |
| description | The description of the confirmation box title | () =&gt; any | - |
| icon | Customize icon of confirmation | () =&gt; any | - |
| okText | The text of the Confirm button | () =&gt; any | - |
| cancelText | The text of the Cancel button | () =&gt; any | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Popconfirm"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

For more questions, please refer to [Tooltip FAQ](/components/tooltip#faq).
