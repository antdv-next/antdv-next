---
category: Components
group: Data Entry
title: Mentions
description: Used to mention someone or something in an input.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

When you need to mention someone or something.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/variant.vue">Variants</demo>
  <demo src="./demo/async.vue">Asynchronous loading</demo>
  <demo src="./demo/form.vue">With Form</demo>
  <demo src="./demo/prefix.vue">Customize Trigger Token</demo>
  <demo src="./demo/readonly.vue">disabled or readOnly</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/allow-clear.vue">With clear icon</demo>
  <demo src="./demo/auto-size.vue">autoSize</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| loading | - | boolean | - | - |
| status | Set validation status | InputStatus | - | - |
| options | Option Configuration | MentionsOptionProps[] | \[] | - |
| popupClassName | - | string | - | - |
| variant | Variants of Input | Variant | `outlined` | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | MentionsClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | MentionsStylesType | - | - |
| size | - | SizeType | - | - |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - | - |
| allowClear | If allow to remove mentions content with clear icon | boolean \| &#123;     clearIcon?: VueNode   &#125; | false | - |
| disabled | - | boolean | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| focus | Trigger when mentions get focus | (event: FocusEvent) =&gt; void | - |
| blur | Trigger when mentions lose focus | (event: FocusEvent) =&gt; void | - |
| change | Trigger when value changed | (value: string) =&gt; void | - |
| select | Trigger when user select the option | (option: MentionsOptionProps, prefix: string) =&gt; void | - |
| popupScroll | Trigger when mentions scroll | (event: Event) =&gt; void | - |
| search | Trigger when prefix hit | (text: string, prefix: string) =&gt; void | - |
| update:value | - | (value: string) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| suffix | - | () =&gt; any | - |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Mentions" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
