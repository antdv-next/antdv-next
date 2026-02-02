---
category: Components
group: Data Display
title: Popover
description: The floating card pops up when clicking/mouse hovering over an element.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kfW5RrfF4L8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*6b8fSKVVtXIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

A simple popup card to provide extra information or operations.

Comparing with `Tooltip`, besides information `Popover` card can also provide action elements like links and buttons.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/trigger-type.vue">Three ways to trigger</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/arrow.vue">Arrow</demo>
  <demo src="./demo/shift.vue" iframe="300">Auto Shift</demo>
  <demo src="./demo/control.vue">Controlling the close of the dialog</demo>
  <demo src="./demo/hover-with-click.vue">Hover with click popover</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Title of the card | VueNode | - | - |
| content | Content of the card | VueNode | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | PopoverClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | PopoverStylesType | - | - |

Popover also supports all Tooltip props. See [Tooltip](/components/tooltip#api).

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when popover visibility changes | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Title of the card | () =&gt; any | - |
| content | Content of the card | () =&gt; any | - |

## Note

Please ensure that the child node of `Popover` can accept `mouseenter`, `mouseleave`, `focus`, `click` events.

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Popover" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

For more questions, please refer to [Tooltip FAQ](/components/tooltip#faq).
