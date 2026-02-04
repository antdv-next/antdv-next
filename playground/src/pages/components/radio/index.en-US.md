---
category: Components
group: Data Entry
title: Radio
description: Used to select a single state from multiple options.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mrPVRope68wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xPfTSphsiA0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <!-- When use RadioGroup, recommended ✅ -->
  <a-radio-group
    v-model:value="value"
    :options="[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
    ]"
  />
  <!--  No recommended 🙅🏻‍♀️  -->
  <a-radio-group v-model:value="value">
    <a-radio :value="1">
      A
    </a-radio>
    <a-radio :value="2">
      B
    </a-radio>
    <a-radio :value="3">
      C
    </a-radio>
  </a-radio-group>
</template>
```

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/disabled.vue">disabled</demo>
  <demo src="./demo/radiogroup.vue">Radio Group</demo>
  <demo src="./demo/radiogroup-more.vue">Vertical Radio.Group</demo>
  <demo src="./demo/radiogroup-block.vue">Block Radio.Group</demo>
  <demo src="./demo/radiogroup-options.vue">Radio.Group group - optional</demo>
  <demo src="./demo/radiobutton.vue">radio style</demo>
  <demo src="./demo/radiogroup-with-name.vue">Radio.Group with name</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/radiobutton-solid.vue">Solid radio button</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Radio/RadioButton

#### Props {#radio-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checked | Specifies whether the radio is selected, support `v-model:checked` | boolean | false |  |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | -|
| disabled | Disable radio | boolean | false |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| value | According to value for comparison, to determine whether the selected | any | - |  |

#### Methods {#radio-methods}

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### RadioGroup

Radio group can wrap a group of `Radio`.

#### Props {#radiogroup-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit RadioGroup width to its parent width | boolean | false | - |
| buttonStyle | The style type of radio button | `outline` \| `solid` | `outline` |  |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| defaultValue | Default selected value | any | - |  |
| disabled | Disable all radio buttons | boolean | false |  |
| name | The `name` property of all `input[type="radio"]` children. If not set, it will fallback to a randomly generated name | string | - |  |
| options | Set children optional | string\[] \| number\[] \| Array&lt;[CheckboxOptionType](#checkboxoptiontype)> | - |  |
| optionType | Set Radio optionType | `default` \| `button` | `default` | - |
| orientation | Orientation | `horizontal` \| `vertical` | `horizontal` |  |
| size | The size of radio button style | `large` \| `middle` \| `small` | - |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| value | Used for setting the currently selected value, support `v-model:value` | any | - |  |
| vertical | If true, the Radio group will be vertical. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false |  |

#### Events {#radiogroup-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes  | (e: RadioChangeEvent) =&gt; void | - |

#### Slots {#radiogroup-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | label render slot | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## Types

### CheckboxOptionType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | The text used to display as the Radio option | `string` | - | - |
| value | The value associated with the Radio option | `string` \| `number` \| `boolean` | - | - |
| style | The style to apply to the Radio option | `CSSProperties` | - | - |
| class | class of the Radio option | `string` | - | - |
| disabled | Specifies whether the Radio option is disabled | `boolean` | `false` | - |
| title | Adds the Title attribute value | `string` | - | - |
| id | Adds the Radio Id attribute value | `string` | - | - |
| onChange | Triggered when the value of the Radio Group changes | `(e: CheckboxChangeEvent) => void;` | - | - |
| required | Specifies whether the Radio option is required | `boolean` | `false` | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Radio"></ComponentTokenTable>
