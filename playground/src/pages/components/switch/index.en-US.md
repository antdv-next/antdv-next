---
category: Components
group: Data Entry
title: Switch
description: Used to toggle between two states.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rtArRpBNDZcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*al07RK8SGf4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- If you need to represent the switching between two states or on-off state.
- The difference between `Switch` and `Checkbox` is that `Switch` will trigger a state change directly when you toggle it, while `Checkbox` is generally used for state marking, which should work in conjunction with submit operation.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/text.vue">Text & icon</demo>
  <demo src="./demo/size.vue">Two sizes</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/component-token.vue" debug>Custom component token</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoFocus | Auto focus when component mounted | boolean | false | - |
| checked | Determine whether the Switch is checked, support `v-model:checked` | string \ | number \ | boolean \ | object | false | - |
| checkedChildren | The content to be shown when the state is checked | VueNode | - | - |
| checkedValue | The value when checked | string \| number \| boolean \| object | true | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | SwitchClassNamesType | - | - |
| defaultChecked | Whether to set the initial state | string \| number \| boolean \| object | false | - |
| defaultValue | Alias for `defaultChecked` | string \| number \| boolean \| object | - | 5.12.0 |
| disabled | Disable switch | boolean | false | - |
| loading | Loading state of switch | boolean | false | - |
| size | The size of the Switch, options: `default` `small` | `default` \| `small` | `default` | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | SwitchStylesType | - | - |
| unCheckedChildren | The content to be shown when the state is unchecked | VueNode | - | - |
| unCheckedValue | The value when unchecked | string \| number \| boolean \| object | false | - |
| value | Alias for `checked`, support `v-model:value` | string \ | number \ | boolean \ | object | - | 5.12.0 |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when the checked state is changing | (checked: boolean, event: Event) =&gt; void | - |
| click | Trigger when clicked | (checked: boolean, event: Event) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| checkedChildren | The content to be shown when the state is checked | () =&gt; VueNode | - |
| unCheckedChildren | The content to be shown when the state is unchecked | () =&gt; VueNode | - |

### Methods {#methods}

| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Switch"></ComponentTokenTable>

## FAQ

### Why not work in Form.Item? {#faq-binding-data}

Form.Item default bind value to `value` property, but Switch value property is `checked`. You can use `v-model:checked` to change bind property.

```vue
<a-form-item name="fieldA">
  <a-switch v-model:checked="form.fieldA" />
</a-form-item>
```
