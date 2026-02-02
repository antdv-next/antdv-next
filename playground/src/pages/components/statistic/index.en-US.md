---
category: Components
group: Data Display
title: Statistic
description: Display statistic number.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YL7PRYNtH-4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BPWDRbSYxJ4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When want to highlight some data.
- When want to display statistic data with description.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/unit.vue">Unit</demo>
  <demo src="./demo/card.vue" background="grey">In Card</demo>
  <demo src="./demo/timer.vue">Timer</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Statistic

#### Props {#statistic-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the Statistic component. Supports object or function | StatisticClassNamesType | - | - |
| decimalSeparator | The decimal separator | string | `.` | - |
| formatter | Customize value display logic | (value: number \| string) =&gt; VueNode | - | - |
| groupSeparator | Group separator | string | `,` | - |
| loading | Loading status of Statistic | boolean | false | - |
| precision | The precision of input value | number | - | - |
| prefix | The prefix node of value | VueNode | - | - |
| styles | Customize inline style for each semantic structure inside the Statistic component. Supports object or function | StatisticStylesType | - | - |
| suffix | The suffix node of value | VueNode | - | - |
| title | Display title | VueNode | - | - |
| value | Display value | string \| number | - | - |
| valueStyle | Set value section style | CSSProperties | - | - |

#### Slots {#statistic-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| formatter | Customize value display logic | (value: number \| string) =&gt; VueNode | - |
| prefix | The prefix node of value | () =&gt; VueNode | - |
| suffix | The suffix node of value | () =&gt; VueNode | - |
| title | Display title | () =&gt; VueNode | - |

### Statistic.Timer

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | StatisticClassNamesType | - | - |
| format | Format as [dayjs](https://day.js.org/) | string | `HH:mm:ss` | - |
| prefix | The prefix node of value | VueNode | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | StatisticStylesType | - | - |
| suffix | The suffix node of value | VueNode | - | - |
| title | Display title | VueNode | - | - |
| type | Timer type, countdown or countup | `countdown` \| `countup` | - | - |
| value | Set target time | number | - | - |
| valueStyle | Set value section style | CSSProperties | - | - |

#### Events {#timer-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when time's changing | (value: number) =&gt; void | - |
| finish | Trigger when time's up, only to be called when type is `countdown` | () =&gt; void | - |

#### Slots {#timer-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | The prefix node of value | () =&gt; VueNode | - |
| suffix | The suffix node of value | () =&gt; VueNode | - |
| title | Display title | () =&gt; VueNode | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Statistic"></ComponentTokenTable>
