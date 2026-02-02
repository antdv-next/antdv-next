---
category: Components
group: Feedback
title: Spin
description: Used for the loading status of a page or a block.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/nested.vue">Embedded mode</demo>
  <demo src="./demo/tip.vue">Customized description</demo>
  <demo src="./demo/delay-and-debounce.vue">Delay</demo>
  <demo src="./demo/custom-indicator.vue">Custom spinning indicator</demo>
  <demo src="./demo/percent.vue">Progress</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/fullscreen.vue">Fullscreen</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| spinning | Whether Spin is visible | boolean | true | - |
| size | The size of Spin, options: `small`, `default` and `large` | SpinSize | `default` | - |
| tip | Customize description content when Spin has children | VueNode | - | - |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number | - | - |
| wrapperClassName | The className of wrapper when Spin has children | string | - | - |
| indicator | The node of the spinning indicator | VueNode | - | - |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | - |
| percent | The progress percentage, when set to `auto`, it will be an indeterminate progress | number \| 'auto' | - | - |
| rootClass | Root container class | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | SpinClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | SpinStylesType | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Content to wrap with Spin | () =&gt; any | - |
| indicator | The node of the spinning indicator | () =&gt; any | - |
| tip | Customize description content when Spin has children | () =&gt; any | - |

### Static Methods

- `Spin.setDefaultIndicator(indicator: VueNode)`

  You can define default spin element globally.

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Spin"></ComponentTokenTable>
