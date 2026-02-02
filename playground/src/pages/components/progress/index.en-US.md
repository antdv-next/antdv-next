---
category: Components
group: Feedback
title: Progress
description: Display the current progress of the operation.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gK_4S6fDRfgAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HJH8Tb1lcYAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

If it will take a long time to complete an operation, you can use `Progress` to show the current progress and status.

- When an operation will interrupt the current interface, or it needs to run in the background for more than 2 seconds.
- When you need to display the completion percentage of an operation.

## Examples {#examples}

<demo-group>
  <demo src="./demo/line.vue">Progress bar</demo>
  <demo src="./demo/circle.vue">Circular progress bar</demo>
  <demo src="./demo/line-mini.vue">Mini size progress bar</demo>
  <demo src="./demo/circle-micro.vue">Responsive circular progress bar</demo>
  <demo src="./demo/circle-mini.vue">Mini size circular progress bar</demo>
  <demo src="./demo/dynamic.vue">Dynamic</demo>
  <demo src="./demo/format.vue">Custom text format</demo>
  <demo src="./demo/dashboard.vue">Dashboard</demo>
  <demo src="./demo/segment.vue">Progress bar with success segment</demo>
  <demo src="./demo/linecap.vue">Stroke Linecap</demo>
  <demo src="./demo/gradient-line.vue">Custom line gradient</demo>
  <demo src="./demo/steps.vue">Progress bar with steps</demo>
  <demo src="./demo/circle-steps.vue">Circular progress bar with steps</demo>
  <demo src="./demo/size.vue">Progress size</demo>
  <demo src="./demo/info-position.vue">Change progress value position</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

Properties shared by all types.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ProgressClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ProgressStylesType | - | - |
| rootClass | Root container class | string | - | - |
| type | To set the type, options: `line` `circle` `dashboard` | ProgressType | `line` | - |
| percent | To set the completion percentage | number | 0 | - |
| format | The template function of the content | (percent?: number, successPercent?: number) =&gt; any | (percent) =&gt; percent + `%` | - |
| status | To set the status of the Progress, options: `success` `exception` `normal` `active`(line only) | (typeof ProgressStatuses)[number] | - | - |
| showInfo | Whether to display the progress value and the status icon | boolean | true | - |
| strokeWidth | - | number | - | - |
| strokeLinecap | To set the style of the progress linecap | 'butt' \| 'square' \| 'round' | `round` | - |
| strokeColor | The color of progress bar | string \| string[] \| ProgressGradient | - | - |
| railColor | The color of unfilled part | string | - | - |
| success | Configs of successfully progress bar | SuccessProps | - | - |
| trailColor | The color of unfilled part. Please use `railColor` instead | string | - | - |
| width | Deprecated. Use `size` instead | number | - | - |
| size | Progress size | number \| [number \| string, number] \| ProgressSize \| &#123; width?: number, height?: number &#125; | `default` | - |

### `type="line"` {#type-line}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count | number | - | - |
| rounding | The function to round the value | (step: number) =&gt; number | Math.round | - |
| strokeColor | The color of progress bar, render `linear-gradient` when passing an object, could accept `string[]` when has `steps`. | string \| string[] \| ProgressGradient | - | - |
| percentPosition | Progress value position, passed in object, `align` indicates the horizontal position of the value, `type` indicates whether the value is inside or outside the progress bar | PercentPositionType | &#123; align: 'end', type: 'outer' &#125; | - |

### `type="circle"` {#type-circle}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count. When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them. When passing number, the default value for `gap` is 2. | number \| &#123; count: number, gap: number &#125; | - | - |
| strokeColor | The color of circular progress, render gradient when passing an object | string \| ProgressGradient | - | - |
| strokeWidth | To set the width of the circular progress, unit: percentage of the canvas width | number | 6 | - |

### `type="dashboard"` {#type-dashboard}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count. When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them. When passing number, the default value for `gap` is 2. | number \| &#123; count: number, gap: number &#125; | - | - |
| gapDegree | The gap degree of half circle, 0 ~ 295 | number | 75 | - |
| gapPlacement | The gap placement, options: `top` `bottom` `start` `end` | GapPlacement | `bottom` | - |
| gapPosition | Deprecated. Please use `gapPlacement` instead | GapPosition | `bottom` | - |
| strokeWidth | To set the width of the dashboard progress, unit: percentage of the canvas width | number | 6 | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>


## Design Token {#design-token}

<ComponentTokenTable component="Progress"></ComponentTokenTable>
