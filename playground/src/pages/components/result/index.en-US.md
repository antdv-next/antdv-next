---
group: Feedback
category: Components
title: Result
description: Used to feedback the processing results of a series of operations.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-e2IRroDJyEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-0kxQrbHx2kAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

Use when important operations need to inform the user to process the results and the feedback is more complicated.

## Examples

<demo-group>
  <demo src="./demo/success.vue">Success</demo>
  <demo src="./demo/info.vue">Info</demo>
  <demo src="./demo/warning.vue">Warning</demo>
  <demo src="./demo/403.vue">403</demo>
  <demo src="./demo/404.vue">404</demo>
  <demo src="./demo/500.vue">500</demo>
  <demo src="./demo/error.vue">Error</demo>
  <demo src="./demo/customIcon.vue">Custom icon</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  |
| extra | Operating area | VueNode | - |  |
| icon | Custom back icon | VueNode | - |  |
| status | Result status, decide icons and colors | `success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `info` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| subTitle | The subTitle | VueNode | - |  |
| title | The title | VueNode | - |  |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Custom back icon | - | - |
| title | The title | - | - |
| subTitle | The subTitle | - | - |
| extra | Operating area | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Result"></ComponentTokenTable>
