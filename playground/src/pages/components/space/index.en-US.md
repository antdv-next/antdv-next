---
category: Components
group: Layout
title: Space
description: Set components spacing.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZiJ3SbOH9SUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*37T2R6O9oi0AAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- Avoid components clinging together and set a unified space.
- Use Space.Compact when child form components are compactly connected and the border is collapsed.

### Difference with Flex component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/vertical.vue">Vertical Space</demo>
  <demo src="./demo/size.vue">Space Size</demo>
  <demo src="./demo/align.vue">Align</demo>
  <demo src="./demo/wrap.vue">Wrap</demo>
  <demo src="./demo/separator.vue">Separator</demo>
  <demo src="./demo/compact.vue">Compact Mode for form component</demo>
  <demo src="./demo/compact-buttons.vue">Button Compact Mode</demo>
  <demo src="./demo/compact-button-vertical.vue">Vertical Compact Mode</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Space

#### Props {#space-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \| `center` \| `baseline` | - | 4.2.0 |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| orientation | The space direction | `vertical` \| `horizontal` | `horizontal` | - |
| separator | Set separator | VueNode | - | - |
| size | The space size | [Size](#size) \| [[Size](#size), [Size](#size)] | `small` | 4.1.0 \| Array: 4.9.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false | 4.9.0 |

#### Slots {#space-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| separator | Set separator | () =&gt; VueNode | - |

### Size

`'small' | 'middle' | 'large' | number`

### SpaceCompact

Use Space.Compact when child form components are compactly connected and the border is collapsed. The supported components are:

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

#### Props {#space-compact-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent's width | boolean | false | 4.24.0 |
| orientation | Set direction of layout | `vertical` \| `horizontal` | `horizontal` | - |
| size | Set child component size | `large` \| `middle` \| `small` | `middle` | 4.24.0 |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Space" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
