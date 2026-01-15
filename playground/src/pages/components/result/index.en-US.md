---
group: Feedback
category: Components
title: Result
description: Used to feedback the processing results of a series of operations.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-e2IRroDJyEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-0kxQrbHx2kAAAAAAAAAAAAADrJ8AQ/original
---

<DocHeading></DocHeading>

## When To Use {#when-to-use}

## Examples {#examples}

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

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | Custom back icon | VueNode | - | - |
| status | Result status, decide icons and colors | ResultStatusType | `info` | - |
| title | The title | VueNode | - | - |
| subTitle | The subTitle | VueNode | - | - |
| extra | Operating area | VueNode | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | ResultClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | ResultStylesType | - | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Custom back icon | () =&gt; any | - |
| title | The title | () =&gt; any | - |
| subTitle | The subTitle | () =&gt; any | - |
| extra | Operating area | () =&gt; any | - |
