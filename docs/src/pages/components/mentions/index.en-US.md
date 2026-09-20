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
  <demo src="./demo/popup-render.vue">Customize Popup</demo>
  <demo src="./demo/allow-clear.vue">With clear icon</demo>
  <demo src="./demo/auto-size.vue">autoSize</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/autosize-textarea-debug.vue" debug>autoSize debug</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| loading | Indicate loading state | boolean | - | - | × |
| status | Set validation status | InputStatus | - | - | × |
| options | Option Configuration | MentionsOptionProps[] | \[] | - | × |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) =&gt; boolean | - | - | × |
| popupClassName | The className of dropdown menu | string | - | - | × |
| popupRender | Customize the dropdown menu rendering | (menu: VueNode) =&gt; VueNode | - | - | × |
| variant | Variants of Input | Variant | `outlined` | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | MentionsClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | MentionsStylesType | - | - | ✓ |
| size | The size of the input box | `large` \| `medium` \| `small` | - | - | × |
| labelRender | Customize the rendering of option content | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - | - | × |
| allowClear | If allow to remove mentions content with clear icon | boolean \| &#123;     clearIcon?: VueNode   &#125; | false | - | ✓ |
| disabled | Whether disabled | boolean | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| focus | Trigger when mentions get focus | (event: FocusEvent) =&gt; void | - |
| blur | Trigger when mentions lose focus | (event: FocusEvent) =&gt; void | - |
| change | Trigger when value changed | (value: string) =&gt; void | - |
| select | Trigger when user select the option | (option: MentionsOptionProps, prefix: string) =&gt; void | - |
| popupScroll | Trigger when mentions scroll | (event: Event) =&gt; void | - |
| search | Trigger when prefix hit | (text: string, prefix: string) =&gt; void | - |
| update:value | Triggered when value updates, used for `v-model:value` | (value: string) =&gt; void | - |

### Option {#option}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value inserted when selected | string | - |
| key | The key value of the option | string | - |
| disabled | Whether the option is disabled | boolean | - |
| class | Class name of the option | string | - |
| style | The style of the option | CSSProperties | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| suffix | Customize the suffix content | () =&gt; any | - |
| popupRender | Customize the dropdown menu rendering | (menu: VueNode) =&gt; VueNode | - |
| labelRender | Customize the rendering of option content | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Mentions" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
