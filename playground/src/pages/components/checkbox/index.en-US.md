---
category: Components
group: Data Entry
title: Checkbox
description: Collect user's choices.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DzgiRbW3khIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G3MjTYXL6AIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/controller.vue">Controlled Checkbox</demo>
  <demo src="./demo/group.vue">Checkbox Group</demo>
  <demo src="./demo/check-all.vue">Check all</demo>
  <demo src="./demo/layout.vue">Use with Grid</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Checkbox

#### Props {#checkbox-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checked | Specifies whether the checkbox is selected, support `v-model:checked` | string \ | number \ | boolean \ | object | false | - |
| checkedValue | The value when checked | string \| number \| boolean \| object | true | - |
| defaultChecked | Whether to set the initial state | string \| number \| boolean \| object | false | - |
| disabled | If disable checkbox | boolean | false | - |
| indeterminate | The indeterminate checked state of checkbox | boolean | false | - |
| unCheckedValue | The value when unchecked | string \| number \| boolean \| object | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### Events {#checkbox-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes | (e: CheckboxChangeEvent) =&gt; void | - |
| focus | Called when entering the component | function() | - |
| blur | Called when leaving the component | function() | - |

### CheckboxGroup

#### Props {#checkboxgroup-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| options | Specifies options | string\[] \| number\[] \| Option\[] | \[] | - |
| disabled | If disable all checkboxes | boolean | false | - |
| name | The `name` property of all `input[type="checkbox"]` children | string | - | - |
| value | Used for setting the currently selected value, support `v-model:value` | (string \ | number \ | boolean)\[] | \[] | - |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - | - |

#### Events {#checkboxgroup-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes | (checkedValue: T[]) =&gt; void | - |

#### Slots {#checkboxgroup-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Checkbox" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
