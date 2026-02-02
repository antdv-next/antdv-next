---
category: Components
group: Data Display
title: Descriptions
description: Display multiple read-only fields in a group.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fHdlTpif6XQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*d27AQJrowGAAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

Commonly displayed on the details page.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/border.vue">border</demo>
  <demo src="./demo/size.vue">Custom size</demo>
  <demo src="./demo/responsive.vue">responsive</demo>
  <demo src="./demo/vertical.vue">Vertical</demo>
  <demo src="./demo/vertical-border.vue">Vertical border</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/block.vue">row</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bordered | Whether to display the border | boolean | false | - |
| size | Set the size of the list. Can be set to `middle`,`small`, or not filled | 'middle' \| 'small' \| 'default' | - | - |
| title | The title of the description list, placed at the top | VueNode | - | - |
| extra | The action area of the description list, placed at the top-right | VueNode | - | - |
| labelRender | - | RenderDescriptionsItem | - | - |
| contentRender | - | RenderDescriptionsItem | - | - |
| column | The number of `DescriptionItems` in a row, could be an object (like `&#123; xs: 8, sm: 16, md: 24&#125;`, but must have `bordered=&#123;true&#125;`) or a number | number \| Partial&lt;Record&lt;Breakpoint, number&gt;&gt; | 3 | - |
| layout | Define description layout | 'horizontal' \| 'vertical' | `horizontal` | - |
| colon | Change default props `colon` value of Descriptions.Item. Indicates whether the colon after the label is displayed | boolean | true | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | DescriptionsStylesType | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | DescriptionsClassNamesType | - | - |
| items | Describe the contents of the list item | DescriptionsItemType[] | - | 5.8.0 |
| id | - | string | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The title of the description list, placed at the top | () =&gt; any | - |
| extra | The action area of the description list, placed at the top-right | () =&gt; any | - |
| labelRender | - | RenderDescriptionsItem | - |
| contentRender | - | RenderDescriptionsItem | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Descriptions" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
