---
category: Components
group: Data Display
title: Segmented
description: Display multiple options and allow users to select a single option.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XJR2TbS1aaQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-9tSSoO_MkIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/vertical.vue">Vertical Direction</demo>
  <demo src="./demo/block.vue">Block Segmented</demo>
  <demo src="./demo/shape.vue">Round shape</demo>
  <demo src="./demo/custom.vue">Custom Render</demo>
  <demo src="./demo/dynamic.vue">Dynamic</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/size.vue">Three sizes of Segmented</demo>
  <demo src="./demo/with-icon.vue">With Icon</demo>
  <demo src="./demo/icon-only.vue">With Icon only</demo>
  <demo src="./demo/with-name.vue">With name</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  |
| classes | Customize class for each semantic structure inside the Segmented component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  |
| defaultValue | Default selected value | string \| number |  |  |
| disabled | Disable all segments | boolean | false |  |
| options | Set children optional | string\[] \| number\[] \| SegmentedItemType\[] | [] |  |
| orientation | Orientation | `horizontal` \| `vertical` | `horizontal` |  |
| size | The size of the Segmented. | `large` \| `middle` \| `small` | `middle` |  |
| styles | Customize inline style for each semantic structure inside the Segmented component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| vertical | Orientation，Simultaneously existing with `orientation`, `orientation` takes priority | boolean | `false` | - |
| value | Currently selected value, support `v-model:value` | string \ | number |  |  |
| shape | shape of Segmented | `default` \| `round` | `default` | - |
| name | The `name` property of all `input[type="radio"]` children. if not set, it will fallback to a randomly generated name | string |  |- |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes  | function(value: string \| number) | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| iconRender | icon render slot | (option: SegmentedLabeledOption) =&gt; any | - |
| labelRender | label render slot | (option: SegmentedLabeledOption) =&gt; any | - |

## Types

### SegmentedItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disabled state of segmented item | boolean | false |  |
| class | The additional css class | string | - |  |
| icon | Display icon for Segmented item | VueNode | - |  |
| label | Display text for Segmented item | VueNode | - |  |
| tooltip | tooltip for Segmented item | string \| [TooltipProps](../tooltip#api) | - |  |
| value | Value for Segmented item | string \| number | - |  |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Segmented"></ComponentTokenTable>
