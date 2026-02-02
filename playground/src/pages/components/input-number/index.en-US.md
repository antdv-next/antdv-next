---
category: Components
group: Data Entry
title: InputNumber
description: Enter a number within certain range with the mouse or keyboard.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JvWbSYhuNlIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1uH-R5kLAMIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

When a numeric value needs to be provided.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/size.vue">Sizes</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/digit.vue">High precision decimals</demo>
  <demo src="./demo/formatter.vue">Formatter</demo>
  <demo src="./demo/keyboard.vue">Keyboard</demo>
  <demo src="./demo/change-on-wheel.vue">Wheel</demo>
  <demo src="./demo/variant.vue">Variants</demo>
  <demo src="./demo/spinner.vue">Spinner</demo>
  <demo src="./demo/out-of-range.vue">Out of range</demo>
  <demo src="./demo/presuffix.vue">Prefix / Suffix</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/focus.vue">Focus</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| size | The height of input box | SizeType | - | - |
| status | Set validation status | InputStatus | - | - |
| disabled | If the input is disabled | boolean | false | - |
| addonBefore | The label text displayed before (on the left side of) the input field, please use Space.Compact instead | VueNode | - | - |
| addonAfter | The label text displayed after (on the right side of) the input field, please use Space.Compact instead | VueNode | - | - |
| prefix | The prefix icon for the Input | VueNode | - | - |
| suffix | The suffix icon for the Input | VueNode | - | - |
| bordered | Deprecated. | boolean | - | - |
| variant | Variants of Input | Variant | `outlined` | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | InputNumberClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | InputNumberStylesType | - | - |
| controls | Whether to show `+-` controls, or set custom arrow icons | boolean \| &#123; upIcon?: VueNode, downIcon?: VueNode &#125; | - | - |
| type | - | 'number' \| 'text' | - | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback triggered when the value is changed | (value: any) =&gt; void | - |
| update:value | - | (value: any) =&gt; void | - |
| input | - | (text: string) =&gt; void | - |
| pressEnter | The callback function that is triggered when Enter key is pressed | (e: KeyboardEvent) =&gt; void | - |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal | (value: any, info: InputNumberStepContext) =&gt; void | - |
| mousedown | - | (e: MouseEvent) =&gt; void | - |
| click | - | (e: MouseEvent) =&gt; void | - |
| mouseup | - | (e: MouseEvent) =&gt; void | - |
| mouseleave | - | (e: MouseEvent) =&gt; void | - |
| mousemove | - | (e: MouseEvent) =&gt; void | - |
| mouseenter | - | (e: MouseEvent) =&gt; void | - |
| mouseout | - | (e: MouseEvent) =&gt; void | - |
| focus | - | (e: FocusEvent) =&gt; void | - |
| blur | - | (e: FocusEvent) =&gt; void | - |
| keydown | - | (e: KeyboardEvent) =&gt; void | - |
| keyup | - | (e: KeyboardEvent) =&gt; void | - |
| compositionstart | - | (e: CompositionEvent) =&gt; void | - |
| compositionend | - | (e: CompositionEvent) =&gt; void | - |
| beforeinput | - | (e: InputEvent) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | The prefix icon for the Input | () =&gt; any | - |
| suffix | The suffix icon for the Input | () =&gt; any | - |
| addonBefore | The label text displayed before (on the left side of) the input field, please use Space.Compact instead | () =&gt; any | - |
| addonAfter | The label text displayed after (on the right side of) the input field, please use Space.Compact instead | () =&gt; any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="InputNumber" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
